export const formatDate = (createDate, updateDate) => {
  if (createDate === updateDate) {
    const result = new Date(createDate)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    return result;
  } else {
    const result =
      new Date(updateDate).toISOString().slice(0, 19).replace("T", " ") +
      " (수정됨)";

    return result;
  }
};
