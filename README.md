# Google Analytics Badges

![Pageviews](https://kubo.vercel.app/api/analytics?viewId=235430310&metric=ga:pageviews&title=pageviews&style=flat&color=blue)

Node.js wrapper serverless service to generate Shields IO-style badges for Google Analytics. Authenticates with the Reporting API using JWT tokens and uses shields to generate badges for traffic stats. Fully customizable. Works with Universal Analytics but not GA4 properties.

## Quickstart

### Obtain service account credentials

Google service account credentials are needed for JWT authentication.

1. Visit `Google Cloud Platform > APIs & Services > Credentials` or [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
2. If you do not already have a project. Click `Create project` and give it a name. Refresh the page if changes aren't showing.
3. With the project selected, add an API by clicking `Dashboard > Enable APIs and services`. Find the Google Analytics Reporting API and enable it.
4. Select `Create credentials > Service account`, give the account a name. Click continue to skip through the optional steps.
5. Click your newly created service account and scroll to the `Keys` section. Select `Add key > Create new key > JSON`, a file will be downloaded.

Your file will look like this. `client_email` and `private_key` are the values you'll need for the next steps.

```
{
  "type": "service_account",
  "project_id": "id-of-project",
  "private_key_id": "a1b2c3d4e5f6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCRApln/AtI3bdq\nOI3gdYHZRDORr/DN+RxMOOIG4eSF77jXJuLPEB8BAoGAFiTHeOhyvXL1Yxks+Xe/\nyCKZ1FPVYbzOR3fbARzwvSFITMEhmPy+A1Gj//D1pCarNg3s2eGKcWbvaU/uFiza\nFNAiPipmFp3Xnt7m07gKw25mgbMScaCJUeLOGdnGNXaHQ2aCieAXiA5aZbyjcyhX\n8vWRouHly8HoEOdrc8BOfTA=\n-----END PRIVATE KEY-----\n",
  "client_email": "eightants@dummydata.gserviceaccount.com",
  "client_id": "1234567890",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/at8/analyticsdummy.gserviceaccount.com"
}
```

### Add users to Analytics

To allow the service account access to your analytics data, you need to add it as a user. Full instructions can be found on [Google's documentation](https://support.google.com/analytics/answer/1009702?hl=en). A summary of the steps is shown below.

1. Sign in to Google Analytics. Click `Admin > Account User Management`.
2. In the Account permissions list, click +, then click Add users.
3. Enter the `client_email` for the service account. In the example file above, this would be `eightants@dummydata.gserviceaccount.com`.
4. Make sure the `Read & Analyze` permission is checked. Then click Add.

Now the setup is complete, time to deploy our serverless functions.

## Deployment

This Node.js project was built with serverless hosting in mind. However, it is also possible to integrate this into your current hosted projects.

### Integrate into existing Node server

Adapt the code in `integrate.js` into your existing server code. Full documentation about the Core Reporting API can be [found here](https://developers.google.com/analytics/devguides/reporting/core/v3/reference).

### Deploying a serverless instance

Since it requires private keys, the best way is to deploy your own instance of this service. We will be using Vercel for free serverless deployments.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Feightants%2Fanalytics-badge&env=CLIENT_EMAIL,PRIVATE_KEY&envDescription=These%20values%20are%20defined%20in%20the%20JSON%20file%20downloaded%20from%20your%20service%20account&envLink=https%3A%2F%2Fgithub.com%2Feightants%2Fanalytics-badge&project-name=analytics&repo-name=analytics-badge)

_Automate steps 1-5 with the button above_

1. Fork the https://github.com/eightants/analytics-badge project to your GitHub account.
2. Create an account on Vercel.
3. From the dashboard page click Import Project then specify the URL to your fork of the project on GitHub.
4. Add the required environment variables CLIENT_EMAIL and PRIVATE_KEY. These values correspond to `client-email` and `private-key` above.

(In this example, the values would be `eightants@dummydata.gserviceaccount.com` and `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCRApln/AtI3bdq\nOI3gdYHZRDORr/DN+RxMOOIG4eSF77jXJuLPEB8BAoGAFiTHeOhyvXL1Yxks+Xe/\nyCKZ1FPVYbzOR3fbARzwvSFITMEhmPy+A1Gj//D1pCarNg3s2eGKcWbvaU/uFiza\nFNAiPipmFp3Xnt7m07gKw25mgbMScaCJUeLOGdnGNXaHQ2aCieAXiA5aZbyjcyhX\n8vWRouHly8HoEOdrc8BOfTA=\n-----END PRIVATE KEY-----\n`)

5. Deploy and visit your application at `<deploy-id>.vercel.app`.

Visit your Google Analytics dashboard and obtain the `viewId` for your project of interest from `Admin > View > View Settings > View ID`. You can now generate shields.io badges for any of your Analytics projects with this endpoint.

```
https://<deploy-id>.vercel.app/api/analytics?viewId=<VIEWID>&metric=<METRIC>&startDate=<STARTDATE>&endDate=<ENDDATE>&title=<TITLE>&unit=<UNIT>&color=<COLOR>&style=<STYLE>&si=<SI>
```

**Query Parameters**
| Param | Description |
| ----------- | ----------- |
| viewId | (Required) The View ID of your Google Analytics property |
| metric | The metric id as specified in [Google dev tools](https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/). Default: `ga:users` |
| startDate | Start date for fetching Analytics data. Requests can specify a start date formatted as `YYYY-MM-DD`, or as a relative date (e.g., `today`, `yesterday`, or `NdaysAgo` where `N` is a positive integer). Default: `7daysAgo`|
| endDate | End date for fetching Analytics data. Requests can specify a start date formatted as `YYYY-MM-DD`, or as a relative date (e.g., `today`, `yesterday`, or `NdaysAgo` where `N` is a positive integer). Default: `today`|
| title | Title for Shields.io badge. Default: `users` |
| unit | Unit of metric displayed on badge, e.g. 20k/week, 300/month. Special characters need to be URL encoded. Default: `%2Fweek` |
| color | Color of shield. Default: `green` |
| style | Shield style according to Shields.io documentation. Default: `plastic` |
| si | Whether to use SI abbreviations for numbers, e.g. 20k, 4M, 8B. Default: `true` |

## Examples

Using analytics data from my project Whisperify.

### Default shield for users per week

In Markdown: `![Users](https://<deploy-id>.vercel.app/api/analytics?viewId=211113681)`

In HTML: `<img src="https://<deploy-id>.vercel.app/api/analytics?viewId=211113681"/>`

![Users Shield](https://kubo.vercel.app/api/analytics?viewId=211113681)

### Pageviews per month

`https://<deploy-id>.vercel.app/api/analytics?viewId=211113681&metric=ga:pageviews&startDate=30daysAgo&title=pageviews&unit=%2Fmonth`

![Views Shield](https://kubo.vercel.app/api/analytics?viewId=211113681&metric=ga:pageviews&startDate=30daysAgo&title=pageviews&unit=%2Fmonth)

### Bounce Rate over the past day with badge styles

`https://<deploy-id>.vercel.app/api/analytics?viewId=211113681&metric=ga:bounceRate&startDate=yesterday&title=Bounce%20Rate&unit=%25&style=for-the-badge&color=blue`

![Shield](https://kubo.vercel.app/api/analytics?viewId=211113681&metric=ga:bounceRate&startDate=yesterday&title=Bounce%20Rate&unit=%25&style=for-the-badge&color=blue)

## Contribute

Feel free to contribute corrections in this guide or provide documentation on how to set up this project on other serverless platforms such as GCP or AWS Lambda.

![Analytics](https://ga-beacon.appspot.com/UA-132344171-6/github.com/Naereen/badges/README.md?pixel)
