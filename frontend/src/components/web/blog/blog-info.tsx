import { Link } from "react-router";
import { Blog } from "../../../types/blog";
import { Button } from "../../ui/button";

interface Props {
  blog: Blog;
}

export const BlogInfo = ({ blog }: Props) => {
  return (
    <div className="flex items-center gap-1 text-sm sm:text-base">
      <Button asChild variant="link" className="p-0">
        <Link to={`/blogs/${blog?.id}`}>{blog?.category}</Link>
      </Button>
      <span className="px-1 truncate">{blog?.author}</span>
      <span className="text-foreground/75 min-w-24">
        {new Date(blog?.created_at).toLocaleDateString("hr-HR")}
      </span>
    </div>
  );
};
