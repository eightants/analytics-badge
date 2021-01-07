const fetchReport = require("../fetchReport.js");
const abbreviate = require("../abbreviate.js");

const key = {
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
};

module.exports = async (req, res) => {
  const {
    query: {
      viewId = "",
      metric = "ga:users",
      startDate = "7daysAgo",
      endDate = "today",
      unit = "/week",
      title = "users",
      color = "green",
      style = "plastic",
      si = "true",
    },
  } = req;

  return fetchReport(key, viewId, metric, startDate, endDate)
    .then(({ data }) => {
      const value = data.reports[0].data.totals[0].values[0];
      return res.redirect(
        302,
        `https://img.shields.io/badge/${encodeURIComponent(title)}-${
          si == "true" ? abbreviate(value) : value
        }${encodeURIComponent(unit)}-${color}.svg?style=${style}`
      );
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
};
