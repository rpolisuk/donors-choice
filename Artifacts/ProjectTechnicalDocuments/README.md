# Technical Architecture
## Overview
The Donor's Choice web site is a three tier web application with the web tier hosted on a web server running on a Heroku site, the application tier hosted on a Node.js/Express site running on a Heroku site, and the database running on the MongoDB Atlas cloud environment.
### Web Stack
The single-page application is written using web application framework Angular with code in Typescript.
### Application Stack
The application stack is written using the Javascript runtime environment, Node.js, with the Express.js web application framework. It responds to REST calls initated by the web browser. All code is written in Javascript. The API calls are documented using Swagger which can also be used for testing the calls. It is located here: https://arcane-escarpment-54741.herokuapp.com/api-docs/#/
### Database Stack
The database stack is using the NoSQL MongoDB Atlas cloud environment.
### Other technology
Email is sent using Twilio SendGrid email cloud service.
## Diagram
The following diagram shows all the components:
<img src="https://github.com/prj666-s21/donors-choice/blob/main/Artifacts/ProjectTechnicalDocuments/DonorsChoice%20Stack.png" align="left" height="400" >
