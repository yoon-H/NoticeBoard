export const formatDate = (date) => {
  const [day, times] = date.split("T");
  const [time, tmp] = times.split(".");

  return day + " " + time;
};
