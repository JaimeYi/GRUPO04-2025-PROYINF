// utils/formatMoney.js
export const formatMoney = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  })
    .format(value)
    .replace("CLP", "$");
};