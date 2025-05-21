export const formatDate = (date) => {
  const result = new Date(date).toISOString().slice(0, 19).replace("T", " ");

  return result;
};
