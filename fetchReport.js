// Function to fetch data from the Google Analytics Reporting API
// Adapted from https://gist.github.com/yi-jiayu/e1fccd54a3ef7a4eed6c2a999420b50c

const { google } = require("googleapis");

module.exports = (key, viewId, metric, startDate, endDate) => {
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ["https://www.googleapis.com/auth/analytics.readonly"],
    null
  );

  return new Promise((resolve, reject) => {
    jwtClient.authorize((err) => {
      if (err) {
        console.log(err);
        return;
      }

      const analytics = google.analyticsreporting("v4");
      analytics.reports.batchGet(
        {
          auth: jwtClient,
          resource: {
            reportRequests: [
              {
                viewId: viewId,
                dateRanges: [
                  {
                    startDate: startDate,
                    endDate: endDate,
                  },
                ],
                metrics: [
                  {
                    expression: metric,
                  },
                ],
              },
            ],
          },
        },
        (err, data) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(data);
          }
        }
      );
    });
  });
};
