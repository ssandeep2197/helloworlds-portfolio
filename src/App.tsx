import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto">
        <Home />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
