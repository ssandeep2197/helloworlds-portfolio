import { useReveal } from '../lib/useReveal';

const services = [
  {
    title: 'Full Stack Development',
    body: 'End-to-end product engineering across React, Node, and SQL/NoSQL databases — built to scale.',
  },
  {
    title: 'System Architecture',
    body: 'Schemas, service boundaries, and the unglamorous decisions that decide whether a product survives growth.',
  },
  {
    title: 'Realtime Systems',
    body: 'WebSockets, queues, caching, and event-driven backends that stay responsive under load.',
  },
  {
    title: 'API Design',
    body: 'Clean, versioned contracts that are a pleasure to integrate against — REST or GraphQL.',
  },
  {
    title: 'Database Engineering',
    body: 'Schema modeling, query tuning, and migrations across SQL and NoSQL — without taking the system down.',
  },
  {
    title: 'DevOps & Delivery',
    body: 'Pipelines, deploys, and observability — getting code from branch to production safely and predictably.',
  },
  {
    title: 'Web Experiences',
    body: 'Interactive sites with WebGL, smooth-scroll choreography, and motion that earns its weight.',
  },
  {
    title: 'Data Structures',
    body: 'Comfortable in the trenches — algorithmic problem solving and clean, efficient code.',
  },
];

const About = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="relative py-32 px-6 md:px-12">
      <div ref={ref} className="reveal max-w-6xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-mute mb-4">01 — About</p>
        <h2 className="text-4xl md:text-6xl font-semibold mb-12 max-w-3xl leading-tight">
          Architecture you can <span className="text-[color:var(--color-glow)]">defend</span>,
          shipped end-to-end.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-mute leading-relaxed text-base md:text-lg max-w-4xl mb-20">
          <p>
            I'm a Senior Full Stack Engineer with six years building production software
            end-to-end. I currently lead backend and system design for realtime mobile
            and web platforms.
          </p>
          <p>
            What I care about: systems that scale without ceremony, code that's still
            maintainable a year later, and shipping things real users can rely on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-edge rounded-2xl overflow-hidden">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="glass p-8 md:p-10 hover:bg-shade transition-colors group"
            >
              <span className="font-mono text-xs text-glow tracking-widest mb-4 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-glow transition-colors">
                {s.title}
              </h3>
              <p className="text-mute text-sm md:text-base leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
