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
  // função para comprar alguma ação para o usuário
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

  // checando se o usuário deixou o campo symbol vazio
  if (req.body.symbol.trim() === "") {
    return res.status(400).json({ symbol: "Must not be empty" });
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
      db.doc(`/users/${req.user.uid}`)
        .get()
        .then((doc) => {
          // conferindo se o usuário tem saldo para a transação
          caixaAntigo = doc.data().caixa;
          if (newTransaction.total > caixaAntigo) {
            return res
              .status(400)
              .json({ caixa: "Saldo não é suficiente para a transação." });
          } else {
            // se ele tiver, criar o documento da transação
            db.collection("transactions")
              .add(newTransaction)
              .then((doc) => {
                docId = doc.id;
                console.log({
                  message: `Documento ${docId} criado com sucesso.`,
                });
              })
              .then(() => {
                // atualizar o valor em caixa do usuário
                db.doc(`/users/${req.user.uid}`)
                  .get()
                  .then((doc) => {
                    let caixa = round(caixaAntigo - newTransaction.total);
                    db.doc(`/users/${req.user.uid}`)
                      .update({ caixa })
                      .then(() => {
                        return res.json(newTransaction);
                      })
                      .catch((err) => {
                        // catch do retorno newTransaction
                        console.error(err);
                        return res.status(500).json({ error: err.code });
                      });
                  })
                  .catch((err) => {
                    // catch da atualização do caixa do usuário
                    console.error(err);
                    return res.status(500).json({ error: err.code });
                  });
              })
              .catch((err) => {
                // catch do acesso ao usuário para alterar o caixa
                console.error(err);
                return res.status(500).json({ error: err.code });
              });
          }
        })
        .catch((err) => {
          // catch do acesso ao user para checar se ele podia fazer a transação
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

exports.sellSymbol = (req, res) => {
  // garantir que eu tenho o symbol que estou tentando vender
  // na quantidade certa e mudar o saldo do usuário

  // checando se o usuário deixou o campo symbol vazio
  if (req.body.symbol.trim() === "") {
    return res.status(400).json({ symbol: "Must not be empty" });
  }

  // checando se a quantidade é um inteiro maior que zero
  // função para comprar alguma ação para o usuário
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
  let purchasedQuantityOfSymbol = 0;
  let;
};
