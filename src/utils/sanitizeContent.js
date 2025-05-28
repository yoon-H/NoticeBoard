import sanitize from "sanitize-html";

export const sanitizePost = (content) => {
  const result = sanitize(content, {
    allowedTags: ["h1", "h2", "p", "b", "i", "u", "a", "img"],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
    },
  });

  return result;
};

export const sanitizeComment = (content) => {
  const result = sanitize(content, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return result;
};
