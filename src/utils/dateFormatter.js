export const formatDate = (createDate, updateDate) => {
  const create = new Date(createDate);
  const update = new Date(updateDate);

  if (create.getTime() === update.getTime()) {
    const result = update.toISOString().slice(0, 19).replace("T", " ");

    return result;
  } else {
    const result =
      update.toISOString().slice(0, 19).replace("T", " ") + " (수정됨)";

    return result;
  }
};
