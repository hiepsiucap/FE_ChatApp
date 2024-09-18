/** @format */

export const shortenString = (str, nums) => {
  if (str.length > nums) {
    return str.substring(0, nums) + "...";
  }
  return str;
};
