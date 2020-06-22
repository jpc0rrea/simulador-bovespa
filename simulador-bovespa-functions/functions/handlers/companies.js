const { db } = require("../utils/admin");

const {
  verifyCompanies,
  verifyCompaniesAndBDRs,
} = require("../utils/verifyCompanies");

exports.getAllCompanies = async (req, res) => {
  // await verifyCompanies();
  await verifyCompaniesAndBDRs();
  db.doc("/companiesAndBDRs/companies")
    .get()
    .then((companiesSnapshot) => {
      let companies = [];
      const allCompanies = companiesSnapshot.data();
      // Ordering the dict
      Object.keys(allCompanies)
        .sort()
        .forEach((companyCode, index) => {
          console.log(companyCode, index);
          if (companyCode === allCompanies[companyCode]) {
            console.log(
              `A empresa ${companyCode} está com problema, logo não foi adicionada a lista.`
            );
          } else {
            companies.push({
              symbol: companyCode,
              name: allCompanies[companyCode],
              fullName: `${companyCode} - ${allCompanies[companyCode]}`,
            });
          }
        });
      return res.json(companies);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
