const { db } = require("./admin");
const { getCompaniesBovespa } = require("./finance");

const verifyCompanies = () => {
  db.doc("/companies/lastChecked")
    .get()
    .then((lastCheckedSnapshot) => {
      const lastCheckedData = new Date(lastCheckedSnapshot.data().date); // último dia que fiz a requisição da API
      const todayDate = new Date();
      const timeDifferenceInDays =
        (todayDate.getTime() - lastCheckedData.getTime()) / 36e5 / 24;
      if (timeDifferenceInDays > 1) {
        // se eu fiz a requisição a mais de 1 dia, faço de novo hoje
        const date = todayDate.toISOString();
        db.doc("/companies/lastChecked")
          .update({ date })
          .then(() => {
            let companiesBovespa;
            getCompaniesBovespa()
              .then((bovespaCompanies) => {
                companiesBovespa = bovespaCompanies;
                companiesBovespa.forEach((company) => {
                  db.collection("companies")
                    .doc(company.code)
                    .set({
                      name: company.name,
                      brazilian: company.brazilian,
                    })
                    .then(() => true)
                    .catch((err) => {
                      console.error(err);
                    });
                });
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { verifyCompanies };
