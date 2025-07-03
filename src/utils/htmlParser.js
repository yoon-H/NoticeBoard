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
    const id = Number(extractFileId($(e).attr("href")));

    if (name && id) list.push({ name, id });
  });

  return list;
};

const removeServerPrefix = (url) => {
  const match = url.match(/(\/uploads\/.+)$/);
  return match ? match[1] : url;
};

const extractFileId = (url) => {
  const match = url.match(/.+\/([0-9]+)$/);
  return match ? match[1] : null;
};
