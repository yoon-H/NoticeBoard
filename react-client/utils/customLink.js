import Link from "@tiptap/extension-link";

export const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      download: {
        default: null,
        parseHTML: (element) => element.getAttribute("download"),
        renderHTML: (attributes) => {
          if (!attributes.download) return {};
          return {
            download: attributes.download,
          };
        },
      },
      target: {
        default: null,
        parseHTML: (element) => element.getAttribute("target"),
        renderHTML: (attributes) => {
          if (!attributes.target) return {};
          return {
            target: attributes.target,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { target, rel, ...attrs } = HTMLAttributes;

    // 필요하다면 rel도 제거
    return ["a", { ...attrs }, 0];
  },
});
