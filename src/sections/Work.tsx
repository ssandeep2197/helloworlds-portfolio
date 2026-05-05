import { useMemo, useState } from 'react';
import { useReveal } from '../lib/useReveal';
import projectsData from '../data/projects.json';

type Project = {
  id: number;
  name: string;
  title: string;
  description: string;
  repoUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
  year: string;
  category: string;
};

const projects = projectsData as Project[];

const Work = () => {
  const [active, setActive] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const ref = useReveal<HTMLDivElement>();

  const filters = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) counts[p.category] = (counts[p.category] || 0) + 1;
    const cats = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return [
      { id: 'all', label: 'All', count: projects.length },
      ...cats.map((c) => ({ id: c, label: c[0].toUpperCase() + c.slice(1), count: counts[c] })),
    ];
  }, []);

  const filtered = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  const INITIAL = 10;
  const visible = showAll ? filtered : filtered.slice(0, INITIAL);

  return (
    <section id="work" className="relative py-32 px-6 md:px-12">
      <div ref={ref} className="reveal max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-mute mb-4">
              02 — Selected Work · {projects.length} projects
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold leading-tight">
              Things I've <span className="text-[color:var(--color-glow)]">shipped</span>.
            </h2>
          </div>

          <ul className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => {
                    setActive(f.id);
                    setShowAll(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] border transition-colors ${
                    active === f.id
                      ? 'border-glow text-glow'
                      : 'border-edge text-mute hover:border-bone hover:text-bone'
                  }`}
                >
                  {f.label}
                  <span className="ml-2 font-mono text-[10px] opacity-60">{f.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {filtered.length === 0 ? (
          <p className="text-mute text-sm">No projects in this category.</p>
        ) : (
          <ul className="divide-y divide-edge border-y border-edge">
            {visible.map((p) => {
              const primary = p.homepage || p.repoUrl;
              const liveLabel = p.homepage ? 'Live →' : 'Repo →';
              return (
                <li key={p.id}>
                  <a
                    href={primary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-12 items-center gap-4 py-7 px-2 hover:bg-shade transition-colors"
                  >
                    <span className="col-span-2 md:col-span-1 font-mono text-xs text-mute">
                      {p.year}
                    </span>

                    <div className="col-span-10 md:col-span-7">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg md:text-2xl font-semibold tracking-tight group-hover:text-glow transition-colors">
                          {p.title}
                        </span>
                        {p.stars > 0 && (
                          <span className="font-mono text-[10px] text-mute uppercase tracking-widest">
                            ★ {p.stars}
                          </span>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-mute text-sm mt-1 max-w-2xl line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>

                    <span className="hidden md:block col-span-2 font-mono text-xs text-mute uppercase tracking-widest truncate">
                      {p.language || '—'}
                    </span>

                    <span className="col-span-12 md:col-span-2 md:text-right font-mono text-xs uppercase tracking-[0.18em] text-mute group-hover:text-glow transition-colors">
                      {liveLabel}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {filtered.length > INITIAL && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="px-6 py-3 rounded-full border border-edge text-sm tracking-wider hover:border-glow hover:text-glow transition-colors"
            >
              {showAll ? 'Show less' : `Show all ${filtered.length}`}
            </button>
          )}
          <a
            href="https://github.com/ssandeep2197"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.3em] text-mute hover:text-glow transition-colors md:ml-auto"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Work;
