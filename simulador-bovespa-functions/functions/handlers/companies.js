const { db } = require("../utils/admin");

const { verifyCompanies } = require("../utils/verifyCompanies");

exports.getAllCompanies = async (req, res) => {
  await verifyCompanies();
  db.collection("companies")
    .get()
    .then((data) => {
      let companies = [];
      data.forEach((company) => {
        if (company.data().brazilian) {
          companies.push({
            symbol: company.id,
            name: company.data().name,
            fullName: `${company.id} - ${company.data().name}`
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
