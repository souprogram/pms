import { MenuIcon, Search, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { cn } from "../../lib/utils";
import { CurrentUserAvatar } from "../current-user-avatar";
import { PmsSmallIcon } from "../icons";
import { Button } from "../ui/button";
import { Searchbar } from "../ui/searchbar";
import { UserModal } from "./user-modal";

const links = [
  {
    title: "O nama",
    options: [
      { label: "Što je PMS?", href: "/sto-je-pms" },
      { label: "Upravni odbor", href: "/upravni-odbor" },
      { label: "Skupština", href: "/skupstina" },
      { label: "Radne grupe", href: "/radne-grupe" },
    ],
  },
  {
    title: "Udruge članice",
    options: [
      { label: `Akademska sportska udruga "UNIPUSPORT"`, href: "/unipusport" },
      {
        label: "Udruga studenata fakulteta prirodnih znanosti u Puli",
        href: "/prirodne-znanosti-pula",
      },
      { label: "Šou program", href: "/sou-program" },
      { label: "Klub studenata arheologije - Herkul", href: "/herkul" },
      { label: "Udruga studenata glazbe - Una corda", href: "/una-corda" },
      {
        label: "Udruga studenata turizma i financija - FINTUR",
        href: "/fintur",
      },
      { label: "Klub studenata Istre", href: "/klub-studenata-istre" },
      {
        label: "Studentski zbor Sveučilišta Jurja Dobrile u Puli",
        href: "/studentski-zbor",
      },
      { label: "Klub studenata povijesti - ISHA Pula", href: "/isha-pula" },
      { label: "Tsuru - Udruga studenata azijskih studija", href: "/tsuru" },
      {
        label: "Klub studenata engleskog jezika i književnosti - ESCA",
        href: "/esca",
      },
    ],
  },
  {
    title: "Baza znanja",
    options: [
      { label: "Dokumenti PMS-a", href: "/dokumenti-pms" },
      { label: "Dokumenti Sveučilišta", href: "/dokumenti-sveucilista" },
      { label: "Zakon je zakon!", href: "/zakon" },
    ],
  },
  {
    title: "Javne politike",
    options: [
      { label: "Za što se zalažemo", href: "/za-sto-se-zalazemo" },
      {
        label: "Deklaracije o Studentskom standardu",
        href: "/deklaracije-studentski-standard",
      },
      {
        label: "Prema lokalnoj i regionalnoj samoupravi",
        href: "/lokalna-samouprava",
      },
    ],
  },
  {
    title: "Kontakti",
    options: [
      { label: "Kontakti", href: "/kontakti" },
      { label: "Impressum", href: "/impressum" },
    ],
  },
];

export const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown !== index ? index : null);
  };

  const toggleMobileDrawer = () => {
    setOpenMobileDrawer((prev) => !prev);
  };

  const toggleUserModal = () => {
    setOpenUserModal((prev) => !prev);
  };

  return (
    <header className="bg-background sticky top-0 flex gap-4 items-center justify-between lg:justify-start px-4 py-2 border-b border-gray-300">
      <div className="flex items-center">
        <Link to="/">
          <PmsSmallIcon />
        </Link>
      </div>

      <div className="hidden lg:block">
        <nav className="divide-foreground divide-x divide-gray-300 flex">
          {links.map((link, index) => (
            <NavItem
              key={link.title}
              link={link}
              isOpen={openDropdown === index}
              toggleDropdown={() => toggleDropdown(index)}
            />
          ))}
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div className="hidden lg:block">
          <Link to="/pretrazi" className="hover:text-gray-500 duration-100">
            <Search size={24} />
          </Link>
        </div>

        <CurrentUserAvatar
          onClick={toggleUserModal}
          className="focus:outline-none cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-1 transition-all rounded-full"
          aria-label="User profile"
        />

        <UserModal isOpen={openUserModal} onClose={toggleUserModal} />
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          className="text-foreground"
          onClick={toggleMobileDrawer}
        >
          <MenuIcon size="24" />
        </button>

        <MobileNavigationDrawer
          isOpen={openMobileDrawer}
          toggle={toggleMobileDrawer}
          links={links}
        />
      </div>
    </header>
  );
};

const MobileNavigationDrawer = ({
  isOpen,
  toggle,
  links,
}: {
  isOpen: boolean;
  toggle: () => void;
  links: { title: string; options: { label: string; href: string }[] }[];
}) => {
  const [saerchParams] = useSearchParams();
  const searchTerm = saerchParams.get("q") || "";

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = (formData.get("q") as string).trim();

    if (search) {
      navigate(`/pretrazi?q=${search}`);
      toggle();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "[--animation-duration:0.3s] backdrop:bg-foreground/50 bg-background m-0 ml-auto min-h-dvh w-full max-w-2xl transition-all transition-discrete duration-[var(--animation-duration)] [animation-direction:forwards] [animation-duration:var(--animation-duration)] [animation-name:close] open:[animation-name:open]",
      )}
    >
      <div className="flex h-full flex-col gap-4 px-4 sm:px-4">
        <div className="bg-background sticky top-0 z-10 py-2">
          <div className="flex items-center justify-between pb-2">
            <Link to="/" onClick={toggle}>
              <PmsSmallIcon />
            </Link>

            <button type="button" className="text-foreground" onClick={toggle}>
              <XIcon size="24" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="basis-full">
              <Searchbar
                name="q"
                defaultValue={searchTerm}
                aria-label="Pretraži"
                placeholder="Pretraži"
              />
            </div>
            <Button type="submit">Pretraži</Button>
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {links.map((link) => (
            <div key={link.title} className="mb-4 flex flex-col gap-1">
              <h4 className="text-foreground font-semibold">{link.title}</h4>
              <ul className="">
                {link.options.map((option) => (
                  <li key={option.label}>
                    <a
                      href={option.href}
                      className="hover:underline hover:text-primary text-foreground block rounded-md px-4 py-1"
                      onClick={toggle}
                    >
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </dialog>
  );
};

const NavItem = ({
  link,
  isOpen,
  toggleDropdown,
}: {
  link: { title: string; options: { label: string; href: string }[] };
  isOpen: boolean;
  toggleDropdown: () => void;
}) => {
  const navigate = useNavigate();

  const handleDropdownItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    href: string,
  ) => {
    event.stopPropagation();
    toggleDropdown();
    navigate(href);
  };

  return (
    <div
      className="relative flex"
      key={link.title}
      onBlur={() => isOpen && toggleDropdown()}
      aria-expanded={isOpen}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        aria-controls={`${link.title}-menu`}
        data-opened={!isOpen && undefined}
        className="hover:text-primary data-opened:text-primary-600 px-6 text-center hover:underline hover:cursor-pointer"
        tabIndex={0}
      >
        {link.title}
      </button>

      {link.options.length > 0 && isOpen && (
        <div className="divide-foreground/10 bg-background absolute top-10 min-w-max divide-y shadow-sm">
          {link.options.map((option) => (
            <button
              type="button"
              onMouseDown={(e) => handleDropdownItemClick(e, option.href)}
              className="hover:bg-primary/15 hover:text-primary-600 block w-full px-2 py-1.5 text-left whitespace-nowrap px-4"
              key={option.label}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
