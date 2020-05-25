const functions = require("firebase-functions");

const express = require("express");
const app = express();

// // https://firebase.google.com/docs/functions/write-firebase-functions

const { FBAuth } = require("./utils/fbAuth");

const { getAllTransactions, buySymbol } = require("./handlers/transactions");
const { signup, login } = require("./handlers/users");

// transactions routes
app.get("/getAllTransactions", FBAuth, getAllTransactions);
app.post("/buySymbol", FBAuth, buySymbol);

// users routes
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
