export const Navbar = () => {
  return (
    <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-16 xl:px-32">
      <div className="flex items-center gap-2">
        <a href="/" className="text-xl font-bold text-primary">
          Pulska mreža studenata
        </a>
      </div>
      <div className="hidden md:flex gap-4">
        <a href="/about" className="text-sm text-secondary hover:text-primary">
          O nama
        </a>
        <a
          href="/kontakt"
          className="text-sm text-secondary hover:text-primary"
        >
          Kontakt
        </a>
      </div>
    </nav>
  );
};
