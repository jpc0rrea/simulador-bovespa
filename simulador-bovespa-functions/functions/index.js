const functions = require("firebase-functions");
const cors = require("cors");

const express = require("express");
const app = express();
app.use(cors());

const { db } = require("./utils/admin");

// // https://firebase.google.com/docs/functions/write-firebase-functions

const { FBAuth } = require("./utils/fbAuth");

const {
  getAllTransactions,
  buySymbol,
  sellSymbol,
  getTransaction,
  commentOnTransaction,
  getSymbolQuote,
  home,
} = require("./handlers/transactions");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getCaixa,
  changePassword
} = require("./handlers/users");

const { getAllCompanies } = require("./handlers/companies");

// transactions routes
app.get("/getAllTransactions", FBAuth, getAllTransactions);
app.post("/buySymbol", FBAuth, buySymbol);
app.post("/sellSymbol", FBAuth, sellSymbol);
app.get("/getTransaction/:transactionId", FBAuth, getTransaction);
app.post("/transaction/:transactionId/comment", FBAuth, commentOnTransaction);
app.post("/quote/", getSymbolQuote);
app.get("/", FBAuth, home);

// users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/caixa", FBAuth, getCaixa)
app.get("/changePassword", changePassword)

// company routes
app.get("/companies", getAllCompanies);

exports.api = functions.https.onRequest(app);

exports.onUserImageChange = functions
  .region("us-east1")
  .firestore.document(`/users/{userId}`)
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection("comments")
        .where("userId", "==", change.before.id)
        .get()
        .then((data) => {
          data.forEach((commentData) => {
            const comment = db.doc(`/comments/${commentData.id}`);
            batch.update(comment, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    } else {
      return true;
    }
  });
