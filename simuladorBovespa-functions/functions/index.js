const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello world!");
});

exports.getTransactions = functions.https.onRequest((req, res) => {
    admin.firestore().collection('transactions').get()
        .then(data => {
            let transactions = []
            data.forEach(doc => {
                transactions.push(doc.data())
        })
        return res.json(transactions)
    })
    .catch(err => {
        console.error(err)
    })
})