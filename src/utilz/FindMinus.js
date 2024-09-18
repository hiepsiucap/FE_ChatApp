/** @format */

export const FindMinus = (time) => {
  if (time == null) {
    return "";
  }
  const inputTime = new Date(time);
  const currentTime = new Date();
  const diffTime = currentTime - inputTime;
  const minutesDifference = Math.floor(diffTime / 1000 / 60);
  const hoursDifference = Math.floor(diffTime / 1000 / 60 / 60);
  const daysDifference = Math.floor(diffTime / 1000 / 60 / 60 / 24);

  // Kiểm tra và hiển thị thời gian phù hợp

  if (minutesDifference < 60) {
    return `${minutesDifference + 1} m`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} h`;
  } else {
    return `${daysDifference} n`;
  }
};
