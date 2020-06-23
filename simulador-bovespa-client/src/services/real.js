const real = (number) => {
  number = number.toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
  });

//   number = number.replace(/\./g, "v");
//   number = number.replace(/\,/g, ".");
//   number = number.replace(/v/g, ",");
  return number;
};

export default real