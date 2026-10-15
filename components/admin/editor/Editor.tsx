"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Callout } from "./Callout";
import { EditorToolbar } from "./EditorToolbar";

export type EditorValue = { html: string; json: unknown; text: string };

type Props = {
  initialHtml: string;
  onChange: (v: EditorValue) => void;
  onPickImage: () => Promise<{ src: string; alt: string } | null>;
};

/**
 * Tiptap-based rich text editor. Output HTML is always re-sanitized by the backend;
 * the editor only produces the document, it is never a trust boundary.
 */
export function Editor({ initialHtml, onChange, onPickImage }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { loading: "lazy" } }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Callout,
      Placeholder.configure({
        placeholder:
          "Start writing. Use the toolbar or Markdown shortcuts (## heading, - list, > quote, ``` code)…",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: "prose-article editor-prose max-w-none px-6 py-5",
        "aria-label": "Article content",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) =>
      onChange({ html: editor.getHTML(), json: editor.getJSON(), text: editor.getText() }),
  });

  // Keep the document in sync if a different article is loaded into the same editor instance.
  useEffect(() => {
    if (editor && initialHtml !== undefined && editor.getHTML() !== initialHtml && editor.isEmpty)
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="border-ink-200 rounded-lg border bg-white">
      <EditorToolbar editor={editor as TiptapEditor | null} onPickImage={onPickImage} />
      <EditorContent editor={editor} />
    </div>
  );
}
