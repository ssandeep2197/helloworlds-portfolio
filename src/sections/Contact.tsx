import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useReveal } from '../lib/useReveal';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const reveal = useReveal<HTMLDivElement>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData(form.current);
      const payload = {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        message: String(fd.get('message') || ''),
        honey: String(fd.get('honey') || ''),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.error || `Request failed (${response.status}).`);
      }

      setPopupMessage('Message sent. Talk soon.');
      form.current.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      const detail = error instanceof Error ? error.message : 'Please try again.';
      setPopupMessage(`Failed to send. ${detail}`);
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3500);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12">
      <div ref={reveal} className="reveal max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-mute mb-4">04 — Contact</p>
        <h2 className="text-4xl md:text-7xl font-semibold mb-12 leading-[0.95]">
          Have an idea?
          <br />
          <span className="text-[color:var(--color-glow)]">Let's build it.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute mb-2">Email</p>
              <a
                href="mailto:s.sandeep2197@gmail.com"
                className="text-lg hover:text-glow transition-colors"
              >
                s.sandeep2197@gmail.com
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute mb-2">Phone</p>
              <a href="tel:+918383066548" className="text-lg hover:text-glow transition-colors">
                +91 8383 066 548
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute mb-2">Based in</p>
              <p className="text-lg">Ghaziabad, UP, India</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute mb-3">Find me</p>
              <div className="flex gap-3">
                {[
                  { href: 'https://www.linkedin.com/in/sandeep2197/', label: 'LinkedIn' },
                  { href: 'https://github.com/sandeepitgcet/', label: 'GitHub' },
                  { href: 'https://twitter.com/sandeep_s_007', label: 'Twitter' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-edge text-xs uppercase tracking-[0.18em] hover:border-glow hover:text-glow transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form
            ref={form}
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass rounded-2xl p-6 md:p-10 grid gap-5"
          >
            <input
              type="text"
              name="honey"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="bg-transparent border-b border-edge focus:border-glow outline-none px-1 py-3 text-sm tracking-wide transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="bg-transparent border-b border-edge focus:border-glow outline-none px-1 py-3 text-sm tracking-wide transition-colors"
              />
            </div>

            <textarea
              name="message"
              placeholder="Tell me about your project"
              required
              rows={5}
              className="bg-transparent border-b border-edge focus:border-glow outline-none px-1 py-3 text-sm tracking-wide resize-none transition-colors"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="group justify-self-start mt-4 px-7 py-3 rounded-full bg-glow text-void font-medium text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition inline-flex items-center gap-3"
            >
              {isSubmitting ? 'Sending…' : 'Send message'}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>
        </div>

        {showPopup && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-8 right-8 glass rounded-full px-6 py-3 text-sm z-50"
          >
            {popupMessage}
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
