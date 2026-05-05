import { useReveal } from '../lib/useReveal';

const Hero = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 md:px-12"
    >
      <div ref={ref} className="reveal max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-glow mb-6 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-glow" />
          Sandeep Singh / Portfolio v3
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] mb-6">
          Building cinematic,
          <br />
          <span className="text-glow text-[color:var(--color-glow)]">performant</span> web
          <br />
          experiences.
        </h1>
        <p className="text-mute text-base md:text-lg max-w-xl leading-relaxed mb-10">
          Full Stack Developer based in UP, India — turning complex problems into
          interfaces that feel inevitable. React, Node, WebGL.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#work"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-glow text-void font-medium text-sm tracking-wider hover:opacity-90 transition"
          >
            See selected work
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-edge text-bone hover:border-glow hover:text-glow transition text-sm tracking-wider"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-mute text-[10px] tracking-[0.4em] uppercase font-mono flex flex-col items-center gap-3">
        <span>Scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-glow to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
