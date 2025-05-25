import { MDXComponents } from "mdx/types";
import { useLoaderData } from "react-router";
import { cn } from "../../lib/utils";

export default function NavPage() {
  const { page: MdxComponent } = useLoaderData();

  const components: MDXComponents = {
    h1: (props) => {
      return (
        <h1
          {...props}
          className="py-10 text-5xl font-bold text-balance hyphens-auto uppercase md:pb-14 md:text-6xl"
        />
      );
    },
    h2: (props) => (
      <h2
        {...props}
        className="py-2 text-2xl font-semibold text-balance hyphens-auto"
      />
    ),
    h3: (props) => (
      <h3
        {...props}
        className="text-xl font-semibold text-balance hyphens-auto"
      />
    ),
    li: ({ children }) => {
      return (
        <li className="flex gap-2">
          <div className="flex h-[1lh]">
            <div className="bg-foreground size-1.25 self-center rounded-full sm:size-1.5" />
          </div>
          <span>{children}</span>
        </li>
      );
    },
    a: (props) => {
      return (
        <a
          {...props}
          className="!text-primary hover:underline"
          target="_blank"
        />
      );
    },
    img: ({ className, ...props }) => {
      return (
        <span className="flex flex-col items-center gap-2">
          <img
            className={cn("h-auto w-full", className)}
            width={672}
            height={672}
            {...props}
          />
          <span className="text-foreground/75 text-base">{props.alt}</span>
        </span>
      );
    },
  };

  return <div>{MdxComponent({ components })}</div>;
}
