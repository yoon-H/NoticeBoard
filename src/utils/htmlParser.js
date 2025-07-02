import * as cheerio from "cheerio";

export const extractContentData = (content) => {

  const $ = cheerio.load(content, { decodeEntities: true });

  const images = extractImageList($);
  const files = extractFileList($);

  return { imageList: images, fileList: files };
};

export const extractImageList = ($) => {
  const list = [];

  $("img").each((i, e) => {
    const src = $(e).attr("src");
    if (src) list.push(removeServerPrefix(src));
  });

  return list;
};

const extractFileList = ($) => {
  const list = [];

  $("a").each((i, e) => {

    if (!$(e).is("[download]") || !$(e).attr("href")) return;
    const name = $(e).text().trim();
    const url = removeServerPrefix($(e).attr("href"));

    if (name && url) list.push({ name, url });
  });

  return list;
};

const removeServerPrefix = (url) => {
  const match = url.match(/(\/uploads\/.+)$/);
  return match ? match[1] : url;
};
