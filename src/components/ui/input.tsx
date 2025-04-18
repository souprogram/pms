import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = ({
  className,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      className={cn(
        "bg-background ring-offset-background focus-visible:ring-primary/75 flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};
