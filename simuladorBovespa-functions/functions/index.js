const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getPrice } = require('./utils/yahooFinance')


admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  return res.json('Hello World!')
});

exports.getTransactions = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("transactions")
    .get()
    .then((data) => {
      let transactions = [];
      data.forEach((doc) => {
        transactions.push(doc.data());
      });
      return res.json(transactions);
    })
    .catch((err) => {
      console.error(err);
    });
});

exports.buyOneSymbol = functions.https.onRequest((req, res) => {
    let quantity = req.body.quantity
    if (parseInt(quantity) === NaN) {
        return res.status(400).json({ quantity: "Deve ser um número inteiro positivo" })
    } else if (parseInt(quantity) < 0) {
        return res.status(400).json({ quantity: "Deve ser um número inteiro positivo" })
    }

    let price;
    let companyName;
    let symbol;
    let docId;
    let newTransaction;
    let caixaAntigo;

    getPrice(req.body.symbol)
        .then(data => {
            price = data.price;
            companyName = data.name;
            symbol = data.symbol;
            total = parseInt(quantity) * price
        })
        .then(() => {
            newTransaction = { 
                userId: '#TODO',
                type: 'Compra',
                total,
                symbol,
                quantity,
                price,
                companyName,
                transactedAt: new Date().toISOString(),
                commentCount: 0,
            }
        })
        .then(() => {
            console.log(newTransaction)
            admin.firestore().collection('transactions').add(newTransaction)
                .then(doc => {
                    res.json({ message: `documento ${doc.id} criado`})
                })
                .catch(err => {
                    console.error(err)
                    res.status(500).json({ error: err })
                })
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: err })
        })
});
