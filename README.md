## Mux Job Node Testing app - based on Northern Trail Manufacturing

### To connect this app with Salesforce

- Install the Salesforce scratch org repo into your new scratch org
- Create a connected app as follows:
  - Connected App Name: Node Mux Toy (or anything you want)
  - API Name: Node_Mux_Toy
  - Contact Email: enter your email address
  - Enabled OAuth Settings: Checked
  - Callback URL: http://localhost:3000/oauth/_callback
  - Selected OAuth Scopes: Full Access (full)
  - Click Save
  - Write down the Consumer Key and the Consumer Secret of your connected app
- Create a password for the default user
  - $ sfdx force:user:password:generate
- [Create a security token for the default user](https://help.salesforce.com/s/articleView?id=sf.user_security_token.htm&type=5)
- Then follow the instructions below to get the code from this repo running on Heroku (or your local machine if you would rather use Node directly)

### Follow the instructions below to deploy your own instance of the application:

1. Make sure you are logged in to the Heroku Dashboard
1. Click the button below to deploy the Node platform_events app on Heroku:

   [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Note - if you get an error from Heroku when trying to deploy using the the above button, the direct link should be https://heroku.com/deploy?template=https://github.com/pickettd/node-nto-platform-events

And if that still doesn't work, an alternative procedure is to fork this repo on Github, then after the fork is complete, you can go to the following url instead (replace the %your-github-username% with your username): https://heroku.com/deploy?template=https://github.com/%your-github-username%/node-nto-platform-events

- Fill in the config variables as follows:
  - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
  - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
  - For **SF_USER_NAME**, enter the the username of your Salesforce user
  - For **SF_USER_PASSWORD**, enter the the password of your Salesforce user
  - For **SF_USER_SECURITY_TOKEN**, enter the security token for the Salesforce user

Read [original blog post](https://developer.salesforce.com/blogs/developer-relations/2017/07/northern-trail-outfitters-new-sample-application-lightning-components-platform-events-salesforce-dx) and [followup blog post](https://developer.salesforce.com/blogs/developer-relations/2017/07/northern-trail-sample-app-part-2-salesforce-node-js-integration-platform-events) for more information.
