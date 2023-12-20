# 370J Media Commons Room Reservation App

## About
This application is designed for reserving rooms at the 370J Media Commons Room. 

## Technologies Used
- **Google App Script**: For backend scripting and integration.
- **React & Google App Script**: Utilizing [React-Google-Apps-Script](https://github.com/enuchi/React-Google-Apps-Script) for a responsive front-end experience.
- **clasp**: For Google Apps Script project management and deployment.

## Deployment
We employ GitHub workflows for our deployment process. 
Any merges into the main branch automatically trigger a deployment to the production Google App Script.

## Preparation
Before setting up the project, ensure you have the following:
- `.clasprc.json` file from another developer.
- `deploymentId` for Google Apps Script.

## Setup Instructions
1. **Clone the Repository**: 
2. **Configure `.clasprc.json`**:
   Set up the `.clasprc.json` file with the necessary credentials.
3. **Install Packages**: 
   ```bash
   npm install
   ```
4. **Upload Local Code to Google App Script**:
   ```bash
   npm run start
   ```
5. **Create a New Version of Google App Script**:
   Deploy using clasp, targeting your `deploymentId`:
   ```bash
   clasp deploy --deploymentId ${deploymentID} -d for local development
   ```
6. **Access the Application**:
   You can now access the app at `https://script.google.com/a/macros/nyu.edu/s/${deploymentId}/exec`.

