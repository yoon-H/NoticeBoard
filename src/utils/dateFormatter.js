export const formatDate = (createDate, updateDate = null) => {
  const create = new Date(createDate).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  const update = new Date(updateDate).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  if (create === update) {
    const result = update;

    return result;
  } else {
    const result = update + " (수정됨)";

    return result;
  }
};
