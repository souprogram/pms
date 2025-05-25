import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BlogContent } from "../web/blog/blog-content";
import { MenuBar } from "./menu-bar";

export const TiptapEditor = ({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: content ?? "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="rounded-md border min-h-[100px] max-w-[80ch]">
      {editor && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className="h-full max-w-none blog-content p-4"
      />

      {/* Debug output */}
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Actual content:</h3>

        <BlogContent content={editor?.getHTML() ?? ""} />
      </div>
    </div>
  );
};
