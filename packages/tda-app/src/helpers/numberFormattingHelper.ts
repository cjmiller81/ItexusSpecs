const numberFormattingHelper = value => {
  let str = value.toString().replace(/[^0-9]/g, "");

  if (str === "") {
    return "0";
  }

  if (str.length > 3) {
    str = str[0] + "," + str.slice(1);
  }

  if (str.length > 5) {
    str = str.slice(0, 5) + "." + str.slice(5);
  }

  if (str.includes(".")) {
    let [integerPart, decimalPart] = str.split(".");
    decimalPart = decimalPart.slice(0, 5);
    str = `${integerPart}.${decimalPart}`;
  }

  return str;
};

export default numberFormattingHelper;
