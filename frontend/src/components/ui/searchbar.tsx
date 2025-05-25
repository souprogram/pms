import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

type SearchbarProps = ComponentProps<typeof Input>;

export const Searchbar = ({ className, ...props }: SearchbarProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex w-10 items-center pl-1">
        <Search className="text-foreground pointer-events-none mx-auto size-4 h-full" />
      </div>
      <Input type="text" className={cn("pl-10", className)} {...props} />
    </div>
  );
};
