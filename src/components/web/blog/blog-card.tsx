import type React from "react";
import { cn } from "../../../lib/utils";
import { Blog } from "../../../types/blog";
import { BlogImgLink } from "./blog-img-link";
import { BlogInfo } from "./blog-info";

type BlogProps = {
  blog: Blog;
  imgClassName?: string;
  noDescription?: boolean;
};

const BlogCard = ({ blog, imgClassName, noDescription }: BlogProps) => {
  const { id, title, description, image_url } = blog;
  const href = `/blogs/${id}`;

  return (
    <div className="flex h-full flex-col gap-2">
      <BlogImgLink
        href={href}
        className={cn("h-60 w-full object-cover object-center", imgClassName)}
        src={image_url}
        alt={title}
        width={800}
        height={400}
      />

      <div className="flex flex-col gap-1">
        <BlogCardHeader href={href}>{title}</BlogCardHeader>
        <BlogInfo blog={blog} />
        {!noDescription && <span className="text-base">{description}</span>}
      </div>
    </div>
  );
};

const BlogCardHeader = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a href={href} className="w-fit">
      <h3 className="hover:text-primary decoration-primary line-clamp-2 text-lg font-semibold text-balance hyphens-auto decoration-3 underline-offset-4 transition">
        {children}
      </h3>
    </a>
  );
};

export { BlogCard, BlogCardHeader };
