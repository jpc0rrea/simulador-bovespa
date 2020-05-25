const { db } = require("../utils/admin");

const { config } = require("../utils/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validators");

exports.signup = (req, res) => {
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let email = req.body.email;

  const newUser = {
    email,
    password,
    confirmPassword,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);
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
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

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
};
