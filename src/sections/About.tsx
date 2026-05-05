import { useReveal } from '../lib/useReveal';

const services = [
  {
    title: 'Full Stack Development',
    body: 'End-to-end product engineering across React, Node, and SQL/NoSQL databases — built to scale.',
  },
  {
    title: 'Realtime Systems',
    body: 'WebSockets, queues, caching, and event-driven backends that stay responsive under load.',
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
          I turn complex problems into <span className="text-[color:var(--color-glow)]">simple</span>,
          intuitive products.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-mute leading-relaxed text-base md:text-lg max-w-4xl mb-20">
          <p>
            Full Stack Developer from UP, India, currently leading backend and system design
            for mobile and web platforms. I work across the stack — from system design to the
            last pixel.
          </p>
          <p>
            My focus is products that are functional, fast, and worth coming back to.
            I bring the same care to architecture as I do to motion and interaction.
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
