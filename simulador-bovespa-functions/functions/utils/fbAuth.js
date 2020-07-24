const { admin } = require("./admin");

const { db } = require("./admin");

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
      req.user.name = data.data().name;
      req.user.imageUrl = data.data().imageUrl;
      req.user.caixa = data.data().caixa
      return next(); // next() deixa a requisição continuar
    })
    .catch((err) => {
      console.error("Erro ao verificar token, ", err);
      return res.status(403).json(err);
    });
};

module.exports = { FBAuth };
