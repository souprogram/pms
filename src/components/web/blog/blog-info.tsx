import { Blog } from "../../../types/blog";
import { Button } from "../../ui/button";

interface Props {
  blog: Blog;
}

export const BlogInfo = ({ blog }: Props) => {
  return (
    <div className="flex items-center gap-1 text-base">
      <Button asChild variant="link" className="p-0">
        <a href={`/blogs/${blog?.id}`}>{blog?.category}</a>
      </Button>
      <span className="px-1">{blog?.author}</span>
      <span className="text-foreground/75">
        {new Date(blog?.created_at).toLocaleDateString("hr-HR")}
      </span>
    </div>
  );
};
