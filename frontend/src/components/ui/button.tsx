import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center border border-transparent whitespace-nowrap rounded-md font-medium text-base transition-all
  focus-visible:ring-offset-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring
  disabled:pointer-events-none disabled:opacity-50 ring-offset-background
  hover:cursor-pointer`,
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-90",
        link: "hover:text-primary decoration-primary underline-offset-4 underline",
        outline: "border-input hover:bg-primary/10",
      },
      size: {
        default: "px-4 py-2",
        sm: "text-xs sm:text-sm px-3 py-1",
        lg: "text-base sm:text-lg px-6 py-3 [@media(pointer:fine)]:p-0",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
Button.displayName = "Button";
