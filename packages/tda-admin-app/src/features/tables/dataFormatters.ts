import moment from "moment";

export const formatTransactTime = (date: string) => moment(date).local().format("YYYY-MM-DD HH:mm:ss");
export const formatTime = (date: Date) => moment(date).local().format("HH:mm:ss");
export const formatDate = (date: Date) => moment(date).local().format("YYYY-MM-DD");

export const formatOrderId = (orderId: string) => orderId.slice(0, 4);
export const formatFilledQty = (qty: string) => {
  const value = Number(qty);
  return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
};
export const formatFilledPrice = (filledPrice: string | number) => {
  const value = typeof filledPrice === "string" ? Number(filledPrice) : filledPrice;
  return value === undefined ? "--" : value?.toFixed(5);
};
