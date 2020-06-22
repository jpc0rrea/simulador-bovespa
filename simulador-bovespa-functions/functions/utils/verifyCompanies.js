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
                      // caso já tenha a empresa, eu escrevo por cima
                      name: company.name, // caso não tenha, eu crio,
                      brazilian: company.brazilian, // por isso usei o set
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

const verifyCompaniesAndBDRs = () => {
  db.doc("/companiesAndBDRs/lastChecked")
    .get()
    .then((lastCheckedSnapshot) => {
      const lastCheckedData = new Date(lastCheckedSnapshot.data().date); // último dia que fiz a requisição da API
      const todayDate = new Date();
      const timeDifferenceInDays =
        (todayDate.getTime() - lastCheckedData.getTime()) / 36e5 / 24;
      if (timeDifferenceInDays > 1) {
        const date = todayDate.toISOString();
        db.doc("/companiesAndBDRs/lastChecked")
          .update({ date })
          .then(() => {
            let companiesBovespa;
            getCompaniesBovespa()
              .then((bovespaCompanies) => {
                companiesBovespa = bovespaCompanies;
                let bdrs = {};
                let companies = {};
                companiesBovespa.forEach((company) => {
                  if (company.brazilian === true) {
                    companies[company.code] = company.name;
                  } else {
                    bdrs[company.code] = company.name;
                  }
                });
                db.collection("companiesAndBDRs")
                  .doc("companies")
                  .update(companies)
                  .then(() => {
                    db.collection("companiesAndBDRs")
                      .doc("BDRs")
                      .update(bdrs)
                      .then(() => true)
                      .catch((err) => {
                        console.error(err);
                      });
                  })
                  .catch((err) => {
                    console.error(err);
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

module.exports = { verifyCompanies, verifyCompaniesAndBDRs };
