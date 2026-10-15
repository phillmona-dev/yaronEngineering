import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutType = "info" | "warning" | "success";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { type?: CalloutType }) => ReturnType;
      toggleCallout: (attrs?: { type?: CalloutType }) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

/** Block-level highlighted information box: <div class="callout" data-type="info">…</div>. */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      type: {
        default: "info",
        parseHTML: (el) => el.getAttribute("data-type") ?? "info",
        renderHTML: (attrs) => ({ "data-type": attrs.type }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div.callout" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "callout" }), 0];
  },
  addCommands() {
    return {
      setCallout:
        (attrs) =>
        ({ commands }) =>
          commands.wrapIn(this.name, attrs),
      toggleCallout:
        (attrs) =>
        ({ commands }) =>
          commands.toggleWrap(this.name, attrs),
      unsetCallout:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});
