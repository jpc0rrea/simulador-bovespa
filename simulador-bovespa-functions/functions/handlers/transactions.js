const { db } = require("../utils/admin");

const { getPrice, round, real, getPriceSync } = require("../utils/finance");

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
      return res.status(500).json({ error: err.code });
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
    return res.status(400).json({ symbol: "Não pode estar vazio" });
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
    return res.status(400).json({ symbol: "Não pode estar vazio" });
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
  let soldQuantityOfSymbol = 0;
  let sharesInPortfolio = 0;

  getPrice(req.body.symbol)
    .then((companyData) => {
      price = companyData.price;
      companyName = companyData.name;
      symbol = companyData.symbol;
      total = parseInt(quantity) * price;
    })
    .then(() => {
      newTransaction = {
        userId: req.user.uid,
        type: "Venda",
        total,
        symbol,
        total,
        quantity,
        price,
        companyName,
        transactedAt: new Date().toISOString(),
        commentCount: 0,
      };
    })
    .then(() => {
      // verificando todas as transações de compra desse ativo
      return db
        .collection("transactions")
        .where("userId", "==", req.user.uid)
        .where("symbol", "==", symbol)
        .where("type", "==", "Compra")
        .get();
    })
    .then((purchaseTransactions) => {
      purchaseTransactions.forEach((transaction) => {
        purchasedQuantityOfSymbol += transaction.data().quantity;
      });
    })
    .then(() => {
      // verificando todas as transações de venda desse ativo
      return db
        .collection("transactions")
        .where("userId", "==", req.user.uid)
        .where("symbol", "==", symbol)
        .where("type", "==", "Venda")
        .get();
    })
    .then((saleTransactions) => {
      saleTransactions.forEach((transaction) => {
        soldQuantityOfSymbol += transaction.data().quantity;
      });
    })
    .then(() => {
      // agora vou verificar se temos ativos suficientes para vender
      sharesInPortfolio = purchasedQuantityOfSymbol - soldQuantityOfSymbol;
      if (quantity > sharesInPortfolio) {
        return res.status(400).json({
          quantity: `Você está tentando vender ${quantity}, mas você só tem ${sharesInPortfolio} ações de ${symbol} no seu portifólio`,
        });
      } else {
        // se ele puder vender, vou realizar a transação
        db.collection("transactions")
          .add(newTransaction)
          .then((doc) => {
            docId = doc.id;
            console.log({ message: `Documento ${docId} criado com sucesso.` });
          })
          .then(() => {
            // atualizar o valor em caixa do usuário
            db.doc(`/users/${req.user.uid}`)
              .get()
              .then((doc) => {
                caixaAntigo = doc.data().caixa;
              })
              .then(() => {
                let caixa = round(caixaAntigo + total);
                db.doc(`/users/${req.user.uid}`)
                  .update({ caixa })
                  .then(() => {
                    return res.json(newTransaction);
                  })
                  .catch((err) => {
                    // catch do update caixa do usuário
                    console.error(err);
                    return res.status(500).json({ error: err.code });
                  });
              })
              .catch((err) => {
                // catch do acesso ao usuário para atualizar seu caixa
                console.error(err);
                return res.status(500).json({ error: err.code });
              });
          })
          .catch((err) => {
            // catch do adicionar nova transação na coleção transactions
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      }
    })
    .catch((err) => {
      // catch de pegar as informações de quantas ações eu tenho no portifólio
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getTransaction = (req, res) => {
  let transactionData = {};
  db.doc(`/transactions/${req.params.transactionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Transação não encontrada" });
      }
      transactionData = doc.data();
      transactionData.transactionId = doc.id;
      if (transactionData.userId !== req.user.uid) {
        return res.status(403).json({ error: "Não autorizado" });
      }
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("transactionId", "==", req.params.transactionId)
        .get();
    })
    .then((data) => {
      transactionData.comments = [];
      data.forEach((doc) => {
        transactionData.comments.push(doc.data());
      });
      return res.json(transactionData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.commentOnTransaction = (req, res) => {
  if (req.body.body.trim() === "")
    return res
      .status(400)
      .json({ body: "O corpo do comentário não pode estar vazio" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    transactionId: req.params.transactionId,
    userName: req.user.name,
    userImage: req.user.imageUrl,
    userId: req.user.uid,
  };

  db.doc(`/transactions/${req.params.transactionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getSymbolQuote = (req, res) => {
  let symbol = req.body.symbol.trim();
  if (symbol === "") {
    return res.status(400).json({ symbol: "Não pode estar vazio" });
  }

  let companyInformation = {};
  getPrice(symbol)
    .then((companyData) => {
      companyInformation.price = companyData.price;
      companyInformation.name = companyData.name;
      companyInformation.symbol = companyData.symbol;
    })
    .then(() => {
      return res.json({
        message: `Uma ação de ${companyInformation.name} (${
          companyInformation.symbol
        }) está custando ${real(companyInformation.price)}`,
        price: companyInformation.price,
        name: companyInformation.name,
        symbol: companyInformation.symbol,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.home = (req, res) => {
  let companiesInPortfolio = {};
  db.collection("transactions")
    .where("userId", "==", req.user.uid)
    .get()
    .then((transactions) => {
      transactions.forEach((transaction) => {
        let symbol = transaction.data().symbol;
        let name = transaction.data().companyName;
        let quantity;
        if (transaction.data().type === "Venda") {
          quantity = -transaction.data().quantity;
        } else {
          quantity = transaction.data().quantity;
        }
        // conferindo se já temos essa empresa na portfólio
        if (symbol in companiesInPortfolio) {
          // se já tivermos, atualizar o valor da quantidade
          companiesInPortfolio[symbol].quantity += quantity;
        } else {
          companiesInPortfolio[symbol] = {
            name,
            quantity,
          };
        }
      });
    })
    .then(() => {
      getPriceSync(companiesInPortfolio)
        .then((data) => {
          db.doc(`/users/${req.user.uid}`)
            .get()
            .then((doc) => {
              const caixa = doc.data().caixa;

              return res.json({ data, caixa });
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).json({ error: err.code });
            });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
