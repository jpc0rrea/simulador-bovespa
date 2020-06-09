const https = require("https");

const getPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    symbol = symbol.trim().toUpperCase();
    if (symbol.search(/\.SA/) === -1) {
      symbol += ".SA";
    }
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
    https.get(url, (res) => {
      let data = "";
      let dataOfCompany;
      let result = {};
      res.on("data", (dados) => {
        data += dados;
      });

      res.on("end", () => {
        try {
          dataOfCompany = JSON.parse(data).quoteResponse.result[0];
          result.price = dataOfCompany.regularMarketPrice;
          result.symbol = dataOfCompany.symbol.split(".")[0];
          result.name = dataOfCompany.longName;
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  });
};

const round = (number) => {
  return Math.round(number * 100) / 100;
};

const real = (number) => {
  number = number.toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
  });

  number = number.replace(/\./g, "v");
  number = number.replace(/\,/g, ".");
  number = number.replace(/v/g, ",");
  return number;
};

const getPriceSync = (portfolio) => {
  return new Promise((resolve, reject) => {
    var actions = Object.keys(portfolio).map(getPrice); // pegando o preço de todas as ações do portfolio

    var results = Promise.all(actions); // actions agora é um array de promises

    results
      .then((data) => {
        data.forEach((company) => {
          portfolio[company.symbol].price = company.price;
          portfolio[company.symbol].total = round(
            portfolio[company.symbol].price * portfolio[company.symbol].quantity
          );
        });
      })
      .then(() => {
        try {
          resolve(portfolio);
        } catch (e) {
          reject(e);
        }
      });
  });
};

const getCompaniesBovespa = () => {
  return new Promise((resolve, reject) => {
    const url =
      "https://eodhistoricaldata.com/api/exchange-symbol-list/SA?api_token=5edf89381feb36.85891176&fmt=json";
    https.get(url, (res) => {
      let data = "";
      let dataOfBovespa;
      let bovespaCompanies = [];
      res.on("data", (dados) => {
        data += dados;
      });

      res.on("end", () => {
        try {
            dataOfBovespa = JSON.parse(data);
            dataOfBovespa.forEach((company) => {
              bovespaCompanies.push({
                code: company.Code,
                name: company.Name,
                brazilian: company.Code.endsWith("34") ? false : true,
              });
            });
            resolve(bovespaCompanies)
        } catch(e) {
            reject(e)
        } 
      });
    });
  });
};

module.exports = { getPrice, round, real, getPriceSync, getCompaniesBovespa };
