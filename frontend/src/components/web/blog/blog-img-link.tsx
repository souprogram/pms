import type { ComponentProps } from "react";
import { Link } from "react-router";
import { cn } from "../../../lib/utils";

type BlogImgLinkProps = ComponentProps<"img"> & {
  href: ComponentProps<"a">["href"];
};

export const BlogImgLink = (props: BlogImgLinkProps) => {
  const { href, className, width, height, alt, ...rest } = props;

  return (
    <Link
      to={href ?? ""}
      className="group/blog-img relative block overflow-hidden rounded-lg"
    >
      <img
        width={width ?? 400}
        height={height ?? 300}
        className={cn(
          "transition duration-300 group-hover/blog-img:scale-102",
          className,
        )}
        alt={alt}
        {...rest}
      />
    </Link>
  );
};
