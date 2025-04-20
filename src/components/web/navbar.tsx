"use client";

import { useEffect, useRef, useState } from "react";
import { Pms } from "../icons/pms";
import { CloseIcon } from "../icons/close-icon";
import { Link, useNavigate } from "react-router";
import { HamburgerIcon } from "../icons/hamburger-icon";
import { cn } from "../../lib/utils";

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
    title: "Projekti",
    options: [
      { label: "PMS.hr", href: "/pms-hr" },
      { label: "PMS app", href: "/pms-app" },
      { label: "Inovacije", href: "/inovacije" },
      { label: "Znanost i istraživanje", href: "/znanost-i-istrazivanje" },
      { label: "Sport", href: "/sport" },
      { label: "Na terenu", href: "/na-terenu" },
    ],
  },
  {
    title: "Baza znanja",
    options: [
      { label: "Dokumenti PMS-a", href: "/dokumenti-pms" },
      { label: "Dokumenti Sveučilišta", href: "/dokumenti-sveucilista" },
      { label: "Releventni Zakoni i odredbe", href: "/zakoni-odredbe" },
    ],
  },
  {
    title: "Udruge članice",
    options: [
      { label: "Akademska sportska udruga 'UNIPUSPORT'", href: "/unipusport" },
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
    title: "Kontakti",
    options: [
      { label: "Kontakti", href: "/kontakti" },
      { label: "Impressum", href: "/impressum" },
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
];

// const getSearchTerm = () => {
//   if (typeof window === "undefined") {
//     return "";
//   }

//   return new URLSearchParams(window.location.search).get("key") || "";
// };

export const Navbar = () => {
  // const searchTerm = getSearchTerm();

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown !== index ? index : null);
  };

  const [isModalOpened, setIsModalOpened] = useState(false);

  const toggleModal = () => {
    setIsModalOpened((prev) => !prev);
  };

  return (
    <header className="bg-background sticky top-0 flex items-center px-4 py-2 shadow sm:p-4">
      <div className="flex items-center">
        <Link to="/">
          <Pms className="h-16 sm:h-24" />
        </Link>
      </div>

      <nav className="divide-foreground hidden divide-x lg:flex">
        {links.map((link, index) => (
          <NavItem
            key={link.title}
            link={link}
            isOpen={openDropdown === index}
            toggleDropdown={() => toggleDropdown(index)}
          />
        ))}
      </nav>

      <div className="ml-auto hidden w-96 lg:block">
        {/* <NavSearchbar defaultValue={searchTerm} /> */}
      </div>

      <button
        type="button"
        className="text-foreground ml-auto block lg:hidden"
        onClick={toggleModal}
      >
        <HamburgerIcon />
      </button>

      <MobileNavigationDrawer
        isOpen={isModalOpened}
        toggle={toggleModal}
        links={links}
      />
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
  // const searchTerm = getSearchTerm();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "[--animation-duration:0.3s]",
        "backdrop:bg-foreground/50 bg-background m-0 ml-auto min-h-dvh w-full max-w-2xl",
        "transition-all transition-discrete duration-[var(--animation-duration)] [animation-direction:forwards] [animation-duration:var(--animation-duration)] [animation-name:close] open:[animation-name:open]",
      )}
    >
      <div className="flex h-full flex-col gap-4 px-4 sm:px-4">
        <div className="bg-background sticky top-0 z-10 py-2">
          <div className="flex items-center justify-between pb-2">
            <Link to="/" onClick={toggle}>
              <Pms className="h-16 sm:h-24" />
            </Link>

            <button type="button" className="text-foreground" onClick={toggle}>
              <CloseIcon />
            </button>
          </div>

          {/* <NavSearchbar defaultValue={searchTerm} /> */}
        </div>

        <nav className="flex-1 overflow-y-auto">
          {links.map((link) => (
            <div key={link.title} className="mb-4">
              <span className="text-foreground mb-2 text-lg font-medium">
                {link.title}
              </span>
              {link.options.map((option) => (
                <a
                  href={option.href}
                  key={option.label}
                  className="hover:bg-primary/25 hover:text-primary-600 text-foreground block rounded-md px-2 py-1"
                  onClick={toggle}
                >
                  {option.label}
                </a>
              ))}
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
        className="hover:text-primary data-opened:text-primary-600 px-6 text-center hover:underline"
        tabIndex={0}
      >
        {link.title}
      </button>

      {link.options.length > 0 && isOpen && (
        <div className="divide-foreground/10 bg-background absolute top-10 min-w-max divide-y rounded-md p-2 shadow-sm">
          {link.options.map((option) => (
            <button
              type="button"
              onMouseDown={(e) => handleDropdownItemClick(e, option.href)}
              className="hover:bg-primary/15 hover:text-primary-600 block w-full px-2 py-1.5 text-left whitespace-nowrap"
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

// const NavSearchbar = ({ defaultValue }: { defaultValue?: string }) => {
//   const [searchTerm, setSearchTerm] = useState(defaultValue);

//   return (
//     <form action={searchAction} className="flex items-center gap-2">
//       <div className="basis-full">
//         <Searchbar
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           name="search"
//           required
//           aria-label="Pretraži"
//           placeholder="Pretraži"
//         />
//       </div>
//       <SubmitButton>Pretraži</SubmitButton>
//     </form>
//   );
// };
