import Scene from './three/Scene';
import Nav from './components/Nav';
import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Resume from './sections/Resume';
import Contact from './sections/Contact';
import { useLenis } from './lib/useLenis';

function App() {
  useLenis();

  return (
    <>
      <Scene />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Resume />
        <Contact />

        <footer className="relative py-10 px-6 md:px-12 border-t border-edge">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs font-mono uppercase tracking-[0.25em] text-mute">
            <span>© {new Date().getFullYear()} Sandeep Singh</span>
            <span>Built with React · Three.js · k3s</span>
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
