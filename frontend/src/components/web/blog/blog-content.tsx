import DOMPurify from "dompurify";
import { useMemo } from "react";

export const BlogContent = ({ content }: { content: string }) => {
  const cleanHtml = useMemo(() => DOMPurify.sanitize(content), [content]);

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};
