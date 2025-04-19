export const BlogContent = ({ content }: { content: string }) => {
  console.log(content);

  return (
    <div className="flex flex-col gap-4 font-serif">
      <p className="first-letter:float-start first-letter:me-2 first-letter:text-[2rem] first-letter:leading-12 sm:first-letter:text-[3rem] sm:first-letter:leading-14">
        Pulska mreža studenata je studentska udruga koja okuplja studente sa
        svih fakulteta u Puli. Naš cilj je povezati studente i pružiti im
        informacije o studentskim događanjima u Puli.
      </p>
      <p className="">
        Naša misija je olakšati studentima pronalazak informacija o studentskim
        događanjima u Puli. PMS je mjesto gdje studenti mogu pronaći informacije
        o predavanjima, radionicama, tečajevima i drugim događanjima u Puli.
      </p>
      <img
        src="https://picsum.photos/800/400"
        className="h-auto w-full"
        alt="Good image truly"
        width={400}
        height={200}
      />
      <p className="text-foreground/75">Caption: Good image truly</p>
      <p className="">
        Zatim slijedi još jedan paragraf teksta koji opisuje što je PMS i koja
        je njegova svrha. Ovaj paragraf teksta je samo primjer i ne odražava
        stvarne informacije o PMS-u. Svakako posjetite našu web stranicu kako
        biste saznali više o PMS-u. Hvala vam na čitanju ovog teksta i nadamo se
        da ćete se pridružiti našoj studentskoj udruzi.
      </p>
      <p className="">
        Pulska mreža studenata je studentska udruga koja okuplja studente sa
        svih fakulteta u Puli. Naš cilj je povezati studente i pružiti im
        informacije o studentskim događanjima u Puli.
      </p>
      <p className="">
        Naša misija je olakšati studentima pronalazak informacija o studentskim
        događanjima u Puli. PMS je mjesto gdje studenti mogu pronaći informacije
        o predavanjima, radionicama, tečajevima i drugim događanjima u Puli.
      </p>
      <img
        src="https://picsum.photos/800/400"
        className="h-auto w-full"
        alt="Good image truly"
        width={400}
        height={200}
      />
      <p className="text-foreground/75">Caption: Good image truly</p>
      <p className="">
        Zatim slijedi još jedan paragraf teksta koji opisuje što je PMS i koja
        je njegova svrha. Ovaj paragraf teksta je samo primjer i ne odražava
        stvarne informacije o PMS-u. Svakako posjetite našu web stranicu kako
        biste saznali više o PMS-u. Hvala vam na čitanju ovog teksta i nadamo se
        da ćete se pridružiti našoj studentskoj udruzi.
      </p>
    </div>
  );
};
