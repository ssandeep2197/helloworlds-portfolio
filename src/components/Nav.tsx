import { useEffect, useState } from 'react';

const links = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

const Nav = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-2 py-2 hidden md:block">
      <ul className="flex items-center gap-1">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={`relative px-4 py-2 text-xs uppercase tracking-[0.18em] rounded-full transition-colors ${
                active === link.id ? 'text-void bg-glow' : 'text-bone hover:text-glow'
              }`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
