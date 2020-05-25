const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getPrice, round } = require("./utils/yahooFinance");
const express = require("express");

admin.initializeApp();
const db = admin.firestore();

const app = express();

const config = {
  apiKey: "AIzaSyCITLLtYTTeal-_QWLORSt3nb7zgyBol68",
  authDomain: "simulador-bovespa-293b3.firebaseapp.com",
  databaseURL: "https://simulador-bovespa-293b3.firebaseio.com",
  projectId: "simulador-bovespa-293b3",
  storageBucket: "simulador-bovespa-293b3.appspot.com",
  messagingSenderId: "628147099992",
  appId: "1:628147099992:web:26c61b901340701be26d2d",
  measurementId: "G-6EMR3SGMMC",
};

const firebase = require("firebase");
firebase.initializeApp(config);

const FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("Nenhum token encontrado");
    return res.status(403).json({ error: "Não autorizado" });
  }

  admin
    .auth()
    .verifyIdToken(idToken) // estamos verificando o idToken
    .then((decodedToken) => {
      // e enviar para o nosso req informações sobre o usuário
      req.user = decodedToken;
      return db.doc(`/users/${req.user.uid}`).get();
    })
    .then((data) => {
      req.user.email = data.data().email;
      return next(); // next() deixa a requisição continuar
    })
    .catch((err) => {
      console.error("Erro ao verificar token, ", err);
      return res.status(403).json(err);
    });
};

app.get("/getAllTransactions", FBAuth, (req, res) => {
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
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

app.post("/buySymbol", FBAuth, (req, res) => {
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
});

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

// https://baseurl.com/api
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

// signup route
app.post("/signup", (req, res) => {
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let email = req.body.email;

  let errors = {};

  // Conferindo se o usuário escreveu algo no e-mail, senha e confirmação de senha
  if (isEmpty(email)) {
    errors.email = "Campo 'e-mail' não pode estar vazio";
  } else if (!isEmail(email)) {
    errors.email = "E-mail inválido";
  }

  if (isEmpty(password)) {
    errors.password = "Campo 'senha' não pode estar vazio";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Senhas devem ser iguais.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const newUser = {
    email,
    password,
    confirmPassword,
  };

  let token, userId;

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        bio: "",
        caixa: 10000,
        createdAt: new Date().toISOString(),
        email: newUser.email,
        imageUrl: "",
        lastName: "",
        location: "",
        name: "",
        website: "",
      };
      return db.doc(`/users/${userId}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ message: "E-mail já está em uso." });
      } else if (err.code === "auth/invalid-email") {
        return res.status(400).json({ message: "E-mail inválido." });
      } else if (err.code === "auth/weak-password") {
        return res
          .status(400)
          .json({ message: "A senha deve conter 6 ou mais digitos" });
      }
      return res.status(500).json({ error: err.code });
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = "Campo 'e-mail' não pode estar vazio";
  if (isEmpty(user.password))
    errors.password = "Campo 'senha' não pode estar vazio";
  if (!isEmail(user.email)) {
    errors.email = "E-mail inválido";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res.status(403).json({ message: "Senha incorreta." });
      } else if (err.code === "auth/user-not-found") {
        return res.status(403).json({ message: "Usuário não encontrado." });
      }
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
