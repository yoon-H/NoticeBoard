function formatDate(date) {
  return new Date(date).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
}

export default function getEffectiveDate(createDate, updateDate) {
  const create = formatDate(createDate);
  const update = formatDate(updateDate);

  return create < update ? update + "(수정됨)" : create;
}
