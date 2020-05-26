const { db } = require("../utils/admin");

const { getPrice, round } = require("../utils/yahooFinance");

exports.getAllTransactions = (req, res) => {
  db.collection("transactions")
    .where("userId", "==", req.user.uid)
    .orderBy("transactedAt", "desc")
    .get()
    .then((data) => {
      let transactions = [];
      data.forEach((doc) => {
        transactions.push({
          transactionId: doc.id,
          commentCount: doc.data().commentCount,
          companyName: doc.data().companyName,
          price: doc.data().price,
          quantity: doc.data().quantity,
          symbol: doc.data().symbol,
          total: doc.data().total,
          transactedAt: doc.data().transactedAt,
          type: doc.data().type,
          userId: doc.data().userId,
        });
      });
      return res.json(transactions);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.buySymbol = (req, res) => {
  let quantity = req.body.quantity;
  if (parseInt(quantity) === NaN) {
    return res
      .status(400)
      .json({ quantity: "Deve ser um número inteiro positivo" });
  } else if (parseInt(quantity) < 0) {
    return res
      .status(400)
      .json({ quantity: "Deve ser um número inteiro positivo" });
  }

  let price;
  let companyName;
  let symbol;
  let docId;
  let newTransaction;
  let caixaAntigo;

  getPrice(req.body.symbol)
    .then((data) => {
      price = data.price;
      companyName = data.name;
      symbol = data.symbol;
      total = round(parseInt(quantity) * price);
    })
    .then(() => {
      newTransaction = {
        userId: req.user.uid,
        type: "Compra",
        total,
        symbol,
        quantity,
        price,
        companyName,
        transactedAt: new Date().toISOString(),
        commentCount: 0,
      };
    })
    .then(() => {
      db.collection("transactions")
        .add(newTransaction)
        .then((doc) => {
          res.json({ message: `documento ${doc.id} criado` });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
