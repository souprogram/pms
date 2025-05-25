import { Outlet } from "react-router";
import { Navbar } from "../../components/web/navbar";

export default function WebLayout() {
  return (
    <div className="font-poppins flex min-h-dvh flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="isolate flex-1 sm:text-lg">
        <section className="container mx-auto px-4 py-4 md:px-8 md:py-8 lg:px-16 xl:px-32">
          <Outlet />
        </section>
      </main>

      <Footer />
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-4 text-center text-sm sm:text-base md:px-8">
      <div className="flex flex-col justify-between gap-x-2 pt-8 lg:flex-row lg:justify-center">
        <span>&copy; 2025 Pulska mreža studenata. Sva prava pridržana.</span>
        <span className="text-foreground/50">
          Powered by{" "}
          <a
            href="https://souprogram.hr"
            className="hover:underline"
            target="_blank"
          >
            Šou program
          </a>
        </span>
      </div>
    </footer>
  );
};
