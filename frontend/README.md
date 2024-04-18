# Frontend
This directory contains the code for the frontend of the software.

## Requirements
- Node.js v21.7.3: To download, follow the guide [here](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

Ensure you are in the `frontend/my-app/` directory. Execute:
```
npm install
```
to install all required dependencies for the frontend.

## Structure
- `my-app/` directory:
    - `src/` directory:
        - `components/` directory:

# Running the Web App
To run the web app, ensure you are in the `frontend/my-app/` directory and execute:
```
npm start
```
The web app will open in your browser at `http://localhost:3000/`. If the user has yet to log in, you will be directed to `http://localhost:3000/login`. Please ensure you use Chrome, Firefox, or Safari as your browser. If you wish to use other browsers, please see [Supported Browsers Configuration](#Supported-Browsers-Configuration).

### Supported Browsers Configuration
By default, the supported browsers for this web application are:
- Chrome
- Firefox
- Safari

If you wish to configure the supported browsers for the web app, you can navigate to `frontend/my-app/` and add your desired browser to `browserslist` in `package.json`.

**e.g. Adding Edge as a supported browser**

Find `package.json` in the `frontend/my-app/` directory.

Find the `browserslist` dictionary and add your desired browser to the `development` list.
```
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version",
      "last 1 edge version"
    ]
  }
```

