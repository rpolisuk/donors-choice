# Overview
The Donor's Choice web site is currently running on a Heroku web site connecting to a Heroku Node.js/Express API server which then connects to a MongoDB cloud database. As well email is provided using Twilio SendGrid. These instructions assume that you will be using the same technology providers however it is possible to swap these with other providers. This is beyond the scope of this document.

# Database component
1. Follow the instructions contained in the following link - https://docs.atlas.mongodb.com/getting-started/ - to create your MongoDB environment.
2. Be sure to get the connection string since this will be needed to be configured below.

# Email component
Follow the instructions contained in the following link - https://devcenter.heroku.com/articles/sendgrid - to generate a SENDGRID API key.

# API Components
The following steps need to be followed to install and configure the Node.js/Express API server to run.
1. Ensure you have Node.js (https://nodejs.org/en/), npm (included in Node.js), and a git client (https://git-scm.com/downloads) installed on your computer first since the instructions will require to use these components.
2. Create a sub-directory to use to install the code.
3. Clone the master branch of GitHub Repo (https://github.com/prj666-s21/donors-choice) onto a Windows machine (any O/S support Node.js would work) into this subdirectory.
4. Run the `npm install` command to load all the dependencies onto your computer.
5. Follow the steps in this link - https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true - to configure your Heroku environment.
6. Edit the config.js file to add your MongoURL and SENDGRID API key which was generated in the instructions above.
7. Test the server by running the command npm start. You should see a "Connected to MongoDB" message to indicate that everything is working.
8. Deploy your application to Heroku.
9. Test the application by going to the Swagger API site at the URL: https://{Replace with your URL}.herokuapp.com/api-docs/#/. Be sure to replace the URL with the one created in step 5 above.

# Web Components
The following steps need to be followed to install and configure the web pages to run.
1. Ensure you have Node.js, npm, and git installed first since the instructions will require to use these components.
2. Create a sub-directory to use to install the code.
3. Clone the master branch of GitHub Repo (https://github.com/prj666-s21/donors-choice) onto a Windows machine (any O/S support Node.js would work) into this subdirectory.
4. Run the `npm install` command to load all the dependencies onto your computer.
5. Test that it is working by issue the command: ng server --open. This will open a browser showing that everything is initially working.
6. Swicth to the src/app directory and edit the charity.service.ts file and replace the Heroku URL with the new one created above when configuring the database.
7. Follow the steps in this link https://itnext.io/how-to-deploy-angular-application-to-heroku-1d56e09c5147 to deploy your Angular app to your Heroku account.
