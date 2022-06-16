## Mux Job Node Testing app - based on Northern Trail Manufacturing

Read [original blog post](https://developer.salesforce.com/blogs/developer-relations/2017/07/northern-trail-outfitters-new-sample-application-lightning-components-platform-events-salesforce-dx) and [followup blog post](https://developer.salesforce.com/blogs/developer-relations/2017/07/northern-trail-sample-app-part-2-salesforce-node-js-integration-platform-events) for more information.

Follow the instructions below to deploy your own instance of the application:

1. Make sure you are logged in to the Heroku Dashboard
1. Click the button below to deploy the manufacturing app on Heroku:

   [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Note - if you get an error from Heroku when trying to deploy using the the above button, an alternative procedure is to fork this repo on Github, then after the fork is complete, you can go to the following url instead (replace the <your-github-username> with your username): https://heroku.com/deploy?template=https://github.com/<your-github-username>/node-nto-platform-events

1. Fill in the config variables as follows:
   - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
   - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
   - For **SF_USER_NAME**, enter the the username of your Salesforce user
   - For **SF_USER_PASSWORD**, enter the the password of your Salesforce user
   - FOR **SF_USER_SECURITY_TOKEN**, enter the security token for the Salesforce user
