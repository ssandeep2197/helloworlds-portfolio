import { useEffect } from 'react';
import Lenis from 'lenis';
import { scrollBus } from './scrollBus';

export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollBus.progress = max > 0 ? window.scrollY / max : 0;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      scrollBus.progress = progress;
      scrollBus.velocity = velocity;
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
