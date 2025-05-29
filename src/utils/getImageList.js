import * as cheerio from "cheerio";

export const getImageList = (content) => {
  const $ = cheerio.load(content);
  const list = [];

  $("img").each((i, e) => {
    const src = $(e).attr("src");
    if (src) list.push(src);
  });

  return list;
};
