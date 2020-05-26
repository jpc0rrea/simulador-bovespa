const functions = require("firebase-functions");

const express = require("express");
const app = express();

// // https://firebase.google.com/docs/functions/write-firebase-functions

const { FBAuth } = require("./utils/fbAuth");

const {
  getAllTransactions,
  buySymbol,
  sellSymbol,
} = require("./handlers/transactions");
const { signup, login, uploadImage } = require("./handlers/users");

// transactions routes
app.get("/getAllTransactions", FBAuth, getAllTransactions);
app.post("/buySymbol", FBAuth, buySymbol);
app.post("/sellSymbol", FBAuth, sellSymbol);

// users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
