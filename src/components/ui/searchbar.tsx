import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { SearchIcon } from "../icons/search";
import { Input } from "./input";

type SearchbarProps = ComponentProps<typeof Input>;

export const Searchbar = ({ className, ...props }: SearchbarProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex w-10 items-center pl-1">
        <SearchIcon className="text-foreground pointer-events-none mx-auto size-4 h-full" />
      </div>
      <Input type="text" className={cn("pl-10", className)} {...props} />
    </div>
  );
};
