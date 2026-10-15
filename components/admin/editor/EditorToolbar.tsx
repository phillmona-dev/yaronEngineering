"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link2,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Undo2,
  Redo2,
  Info,
  Rows3,
  Columns3,
  Trash2,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Btn = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolButton({ b }: { b: Btn }) {
  return (
    <button
      type="button"
      title={b.label}
      aria-label={b.label}
      aria-pressed={b.active}
      disabled={b.disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={b.onClick}
      className={cn(
        "text-ink-600 hover:bg-ink-100 hover:text-ink-900 flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-40",
        b.active && "bg-ink-900 hover:bg-ink-900 text-white hover:text-white",
      )}
    >
      <b.icon className="size-4" />
    </button>
  );
}

const Sep = () => <span aria-hidden className="bg-ink-200 mx-1 h-5 w-px" />;

export function EditorToolbar({
  editor,
  onPickImage,
}: {
  editor: Editor | null;
  onPickImage: () => Promise<{ src: string; alt: string } | null>;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            h4: e.isActive("heading", { level: 4 }),
            p: e.isActive("paragraph"),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            code: e.isActive("codeBlock"),
            link: e.isActive("link"),
            table: e.isActive("table"),
            callout: e.isActive("callout"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });
  if (!editor || !state) return <div className="border-ink-100 h-11 border-b" />;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) return editor.chain().focus().extendMarkRange("link").unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const addImage = async () => {
    const pick = await onPickImage();
    if (pick) editor.chain().focus().setImage({ src: pick.src, alt: pick.alt }).run();
  };

  const groups: Btn[][] = [
    [
      {
        label: "Undo",
        icon: Undo2,
        disabled: !state.canUndo,
        onClick: () => editor.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2,
        disabled: !state.canRedo,
        onClick: () => editor.chain().focus().redo().run(),
      },
    ],
    [
      {
        label: "Paragraph",
        icon: Pilcrow,
        active: state.p,
        onClick: () => editor.chain().focus().setParagraph().run(),
      },
      {
        label: "Heading 2",
        icon: Heading2,
        active: state.h2,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "Heading 3",
        icon: Heading3,
        active: state.h3,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        label: "Heading 4",
        icon: Heading4,
        active: state.h4,
        onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      },
    ],
    [
      {
        label: "Bold",
        icon: Bold,
        active: state.bold,
        onClick: () => editor.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: Italic,
        active: state.italic,
        onClick: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        active: state.underline,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
      },
      {
        label: "Strikethrough",
        icon: Strikethrough,
        active: state.strike,
        onClick: () => editor.chain().focus().toggleStrike().run(),
      },
    ],
    [
      {
        label: "Bullet list",
        icon: List,
        active: state.ul,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        label: "Numbered list",
        icon: ListOrdered,
        active: state.ol,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "Quote",
        icon: Quote,
        active: state.quote,
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        label: "Code block",
        icon: Code2,
        active: state.code,
        onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        label: "Callout",
        icon: Info,
        active: state.callout,
        onClick: () => editor.chain().focus().toggleCallout({ type: "info" }).run(),
      },
      {
        label: "Divider",
        icon: Minus,
        onClick: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
    [
      {
        label: state.link ? "Edit link" : "Add link",
        icon: Link2,
        active: state.link,
        onClick: setLink,
      },
      {
        label: "Remove link",
        icon: Unlink,
        disabled: !state.link,
        onClick: () => editor.chain().focus().unsetLink().run(),
      },
      { label: "Insert image", icon: ImageIcon, onClick: addImage },
      {
        label: "Insert table",
        icon: TableIcon,
        active: state.table,
        onClick: () =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
    ],
    state.table
      ? [
          {
            label: "Add row below",
            icon: Rows3,
            onClick: () => editor.chain().focus().addRowAfter().run(),
          },
          {
            label: "Add column after",
            icon: Columns3,
            onClick: () => editor.chain().focus().addColumnAfter().run(),
          },
          {
            label: "Delete table",
            icon: Trash2,
            onClick: () => editor.chain().focus().deleteTable().run(),
          },
        ]
      : [],
  ].filter((g) => g.length);

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="border-ink-100 sticky top-14 z-20 flex flex-wrap items-center gap-0.5 border-b bg-white/95 px-2 py-1.5 backdrop-blur lg:top-0"
    >
      {groups.map((g, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && <Sep />}
          {g.map((b) => (
            <ToolButton key={b.label} b={b} />
          ))}
        </div>
      ))}
    </div>
  );
}
