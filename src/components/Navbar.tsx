const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="container mx-auto flex justify-between">
      <h1 className="font-bold text-xl">HelloWorlds</h1>
      <div className="space-x-4">
        <a href="#projects">Projects</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>
);
export default Navbar;
