const https = require('https')


const getPrice = (symbol) => {
    return new Promise((resolve, reject) => {
        symbol = symbol.trim().toUpperCase()
        if (symbol.search(/\.SA/) === -1) {
            symbol += '.SA';
        }
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        https.get(url, (res) => {
            let data = ""
            let dataOfCompany;
            let result = {}
            res.on("data", (dados) => {
                data += dados
            });

            res.on("end", () => {
                try {
                    dataOfCompany = JSON.parse(data).quoteResponse.result[0]
                    result.price = dataOfCompany.regularMarketPrice
                    result.symbol = dataOfCompany.symbol.split(".")[0]
                    result.name = dataOfCompany.longName
                    resolve(result)
                } catch (e) {
                    reject(e)
                }
            })
        })

    })
}

// getPrice("ITSA4").then((data) => console.log(data));
module.exports = { getPrice }