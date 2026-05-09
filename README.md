# helloworlds-portfolio

Personal portfolio site — **[helloworlds.co.in](https://helloworlds.co.in)**.

React 19 + TypeScript + Vite, served as a static SPA from nginx inside k3s on a Hostinger VPS. CI/CD via GitHub Actions: every push to `main` rebuilds, ships the image into the cluster, and rolls it out in ~50 seconds.

---

## Tech stack

| Layer | Tool |
|---|---|
| UI | React 19, TypeScript, Tailwind v4 |
| 3D / motion | `@react-three/fiber`, drei, postprocessing, GSAP, Lenis |
| Build | Vite 6 |
| Container | nginx 1.27-alpine serving static `dist/` |
| Orchestration | k3s (single-node Kubernetes) |
| Ingress | ingress-nginx (Traefik disabled) |
| TLS | cert-manager + Let's Encrypt (`letsencrypt-prod` ClusterIssuer) |
| CI/CD | GitHub Actions (`ubuntu-latest`, Node 24 LTS) |

---

## Local development

```bash
npm install
npm run dev          # vite dev server, http://localhost:5173
npm run build        # → dist/  (also regenerates src/data/projects.json)
npm run lint
npm run preview      # serve dist/ locally
```

`npm run build` runs `scripts/fetch-repos.mjs` first to pull the latest GitHub repo metadata into `src/data/projects.json`, then `tsc -b && vite build`.

---

## Deployment

### How it works (push-to-main → live in ~50s)

```
   git push origin main
           │
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│ GitHub Actions runner (ubuntu-latest, x86_64, Node 24)               │
│                                                                       │
│ 1. checkout                                                           │
│ 2. npm ci                                                             │
│ 3. npm run build         ── fetch-repos → tsc → vite build → dist/    │
│ 4. compute tag           ── v<UTC-timestamp>-<sha7>                   │
│ 5. docker build          ── nginx:alpine + dist/ + nginx.conf         │
│ 6. write SSH key from VPS_SSH_KEY secret (validated with ssh-keygen)  │
│ 7. docker save | gzip | ssh "gunzip | k3s ctr images import -"        │
│ 8. sed __TAG__ in deploy/k8s.yaml | ssh kubectl apply -f -            │
│ 9. ssh kubectl rollout status                                         │
└──────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│ VPS (193.203.162.32, Ubuntu 24.04, k3s)                              │
│                                                                       │
│   k3s containerd  ◄── image imported (no external registry)           │
│        │                                                              │
│        ▼                                                              │
│   Deployment portfolio-web (2 replicas, IfNotPresent)                 │
│        │                                                              │
│        ▼                                                              │
│   Service portfolio-web (ClusterIP :80)                               │
│        ▲                                                              │
│        │                                                              │
│   Ingress portfolio-ingress  ── helloworlds.co.in, www.* (TLS)        │
│   Ingress portfolio-redirect ── portfolio.* → 301 → apex (TLS)        │
│        ▲                                                              │
│        │                                                              │
│   ingress-nginx-controller :80/:443                                   │
│        ▲                                                              │
│        │ TLS terminated here, cert-manager auto-renews                │
│   public traffic (helloworlds.co.in / www / portfolio.*)              │
└──────────────────────────────────────────────────────────────────────┘
```

### Why this shape

- **Build on the runner, not the VPS.** Runner is x86_64 — same arch as the VPS — so we skip cross-arch builds and keep the server lean. (The legacy `scripts/deploy.sh` builds on the VPS instead, because Macs are arm64.)
- **No external image registry.** `docker save | k3s ctr images import` puts the image straight into k3s's containerd over an SSH pipe. One fewer service to pay for or secure.
- **Tag = `v<UTC-timestamp>-<sha7>`.** The Deployment uses `imagePullPolicy: IfNotPresent`, so the tag has to change every push or the rollout would be a no-op.
- **Two ingresses, not one.** `nginx.ingress.kubernetes.io/permanent-redirect` is per-ingress, not per-host — so the apex/www pair lives on `portfolio-ingress` and the `portfolio.*` 301 lives on `portfolio-redirect-ingress` with its own TLS cert.

### What you need to set up once

1. **DNS** A records → `193.203.162.32` for: `helloworlds.co.in`, `www.helloworlds.co.in`, `portfolio.helloworlds.co.in`.
2. **GitHub repo secret `VPS_SSH_KEY`** — private key whose public half is in `root@193.203.162.32:~/.ssh/authorized_keys`. Set it byte-perfectly with:
   ```bash
   gh secret set VPS_SSH_KEY --repo ssandeep2197/helloworlds-portfolio < ~/.ssh/id_ed25519
   ```
   (Pasting via the GitHub UI sometimes corrupts line endings — `gh secret set` reading the file is reliable.)
3. **Cluster prerequisites** (already installed on the VPS): k3s with Traefik disabled, ingress-nginx, cert-manager with `letsencrypt-prod` ClusterIssuer.

### Manual / offline deploy

`scripts/deploy.sh` (`npm run deploy`) is the original Mac-driven path: rsyncs source to the VPS, builds the image *on the server* (because Macs are arm64 and the VPS is x86_64), imports it, applies. Useful when CI is broken or you can't push to `main`.

---

## Kubernetes architecture

### Cluster

- **k3s** v1.35 on a single Hostinger VPS (`srv1656103`, Ubuntu 24.04, x86_64). Node is both control-plane and worker.
- **Container runtime:** containerd (k3s default). Images are loaded via `k3s ctr images import`, no Docker daemon involved at runtime.
- **Networking:** flannel (k3s default), pod CIDR `10.42.0.0/16`, service CIDR `10.43.0.0/16`.
- **Storage:** `local-path` StorageClass (k3s default) — not used by the portfolio (everything is baked into the image).

### Cluster-wide components

| Namespace | Workload | Role |
|---|---|---|
| `ingress-nginx` | `ingress-nginx-controller` | The single HTTP/HTTPS entry point. Terminates TLS, routes by Host header. |
| `cert-manager` | controller, cainjector, webhook | Watches Ingress resources, requests + renews Let's Encrypt certs (HTTP-01 challenge). |
| `kube-system` | `coredns`, `metrics-server`, `local-path-provisioner`, `svclb-ingress-nginx` | k3s built-ins. `svclb-*` is k3s's host-port service load balancer that exposes ingress-nginx on the node's :80/:443. |

### `portfolio` namespace

```
deploy/k8s.yaml
├── Namespace: portfolio
├── Deployment: portfolio-web
│     replicas: 2
│     image:    helloworlds-portfolio:<tag>   (IfNotPresent — local image only)
│     probes:   readiness + liveness on GET /
│     limits:   200m CPU / 128Mi memory
├── Service: portfolio-web   (ClusterIP, :80)
├── Ingress: portfolio-ingress
│     hosts:   helloworlds.co.in, www.helloworlds.co.in
│     TLS:     portfolio-tls (cert-manager, letsencrypt-prod)
│     extra:   from-to-www-redirect annotation
└── Ingress: portfolio-redirect-ingress
      host:    portfolio.helloworlds.co.in
      TLS:     portfolio-redirect-tls (separate cert)
      action:  permanent-redirect → https://helloworlds.co.in$request_uri
```

### Request lifecycle

1. Browser resolves `helloworlds.co.in` → `193.203.162.32`.
2. Hits VPS `:443` → `svclb-ingress-nginx` (k3s host-port shim) → `ingress-nginx-controller` pod.
3. ingress-nginx finds TLS secret `portfolio-tls` in namespace `portfolio`, terminates TLS.
4. Reads `Host` header, matches `portfolio-ingress` rule for `helloworlds.co.in` → `Service portfolio-web:80`.
5. kube-proxy load-balances to one of the two `portfolio-web` pods (round-robin within iptables).
6. Pod's nginx serves the static SPA from `/usr/share/nginx/html` (= the `dist/` baked into the image), with cache headers and SPA fallback to `/index.html`.

For `portfolio.helloworlds.co.in`, step 4 instead matches `portfolio-redirect-ingress` and the controller responds `301` directly — never reaches the backend.

---

## Operations cheat sheet

All commands run on the VPS (`ssh root@193.203.162.32 '<cmd>'`) or locally if you've copied `/etc/rancher/k3s/k3s.yaml` to your `~/.kube/config` (rewriting `127.0.0.1` → `193.203.162.32`).

```bash
# State
kubectl get pods -A                                        # everything
kubectl get all -n portfolio                               # the app
kubectl get ingress -A                                     # who owns which host
kubectl get certificate -n portfolio                       # TLS health

# Logs
kubectl logs -n portfolio deploy/portfolio-web -f          # tail
kubectl logs -n portfolio deploy/portfolio-web --previous  # last container's logs

# Rollouts
kubectl rollout status  deploy/portfolio-web -n portfolio
kubectl rollout history deploy/portfolio-web -n portfolio
kubectl rollout undo    deploy/portfolio-web -n portfolio  # back one revision
kubectl rollout restart deploy/portfolio-web -n portfolio  # re-pull, re-spin pods

# Debug
kubectl describe pod -n portfolio <pod>                    # events, image pull, restart reason
kubectl exec -it -n portfolio deploy/portfolio-web -- sh
kubectl get events -n portfolio --sort-by=.lastTimestamp | tail -20

# Resource usage (metrics-server is installed)
kubectl top pods -A
kubectl top nodes
```

---

## Repository layout

```
.
├── .github/workflows/deploy.yml   CI: build → ship to k3s → rollout
├── deploy/
│   ├── k8s.yaml                   Namespace, Deployment, Service, Ingresses
│   └── nginx.conf                 nginx config baked into the image (gzip, caching, SPA fallback)
├── scripts/
│   ├── deploy.sh                  Manual deploy from Mac (build on server)
│   └── fetch-repos.mjs            Pulls GitHub repo metadata → src/data/projects.json
├── Dockerfile                     nginx:alpine + dist/
├── src/                           React app
└── vite.config.ts                 base: '/'  (was '/helloworlds-portfolio/' for GH Pages)
```
