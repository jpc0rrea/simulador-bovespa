const { db, admin } = require("../utils/admin");

const { config } = require("../utils/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../utils/validators");

exports.signup = (req, res) => {
  let password = req.body.password.trim();
  let confirmPassword = req.body.confirmPassword.trim();
  let email = req.body.email.trim();
  let name = req.body.name.trim();
  let lastName = req.body.lastName.trim();

  const newUser = {
    email,
    password,
    confirmPassword,
    name,
    lastName,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;

  const noImg = "no-img.png";

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        lastName: newUser.lastName,
        location: "",
        name: newUser.name,
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

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Tipo de arquivo não aceito." });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.uid}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Imagem atualizada com sucesso" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.uid}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Detalhes adicionados com sucesso" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("transactions")
          .where("userId", "==", req.user.uid)
          .get();
      }
    })
    .then((data) => {
      userData.transactions = [];
      data.forEach((doc) => {
        userData.transactions.push(doc.data());
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
