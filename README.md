# P13 - ESG Management System (Web Application) for FinTech Industry
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Installation and Setup Guide](#installation-and-setup-guide)
   * [Requirements](#requirements)
   * [Instructions for Initial Installation](#instructions-for-initial-installation)
   * [Instructions for Running the App after First Installation and Setup](#instructions-for-running-the-app-after-first-installation-and-setup)
   * [Running the Server](#running-the-server)
   * [Supported Browsers Configuration](#supported-browsers-configuration)
- [Documentation  ](#documentation)

## Overview
This project aims to create an ESG Management System where investors can easily and efficiently evaluate the ESG performances of companies by viewing frameworks and metrics and managing a portfolio of their investments.

![image](https://github.com/moawhi/ESG_Investing/assets/54211192/3f2168b2-c7a8-472e-afc5-63aedd03aee6)
![image](https://github.com/moawhi/ESG_Investing/assets/54211192/af331d18-0b88-464d-aed1-cc819210eba6)

## Getting Started
To use the software, `git clone` this repository and follow the [Installation and Setup Guide](#Installation-and-Setup-Guide).

## Installation and Setup Guide
### Requirements
If you do not have any of the following installed, you can follow the links to find the relevant guides for your system.
- Python 3.9.x or later: To download, follow the guide for your system [here](https://www.python.org/downloads/)
- pip: No action required as this should be downloaded when Python is installed
- MySQL 8.0: To download, follow the guide for your system [here](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/installing.html)
- Node.js v21.7.3: To download, follow the guide [here](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

### Instructions for Initial Installation
If you are installing and setting up the software for the first time, these instructions will let you install all necessary dependencies and set up the database in order for the software to run. Execute the commands from your terminal.

1. Navigate to the `backend/` directory and execute:
```
pip3 install -r requirements.txt
```
This will install the required dependencies to run the backend code of the software.

2. Navigate to the `database/` directory. Connect to your MySQL server as the root user:
```
mysql -u root -p
```
or
```
sudo mysql -u root -p
```
or any other variant of how you've configured how to connect to your root user for MySQL.
Next, while connected to MySQL, execute the following commands line by line:
```
CREATE DATABASE IF NOT EXISTS esg_management;
CREATE USER IF NOT EXISTS esg@localhost IDENTIFIED BY 'esg';
GRANT ALL PRIVILEGES ON esg_management.* TO esg@localhost;
FLUSH PRIVILEGES;
USE esg_management;
```
Next, execute:
```
source ddl.sql;
```
Once this script is finished, execute:
```
source example_dml.sql;
```
It may take a few minutes for the script to finish. Once this script is finished, your database should be populated and you can disconnect from MySQL.

3. Open a separate terminal and ensure you are in the root directory of the project code. Execute the following command:
```
python3 -m backend.src.server
```
This will run the server. See [Running the Server](#Running-the-Server) for additional details.

4. Open a separate terminal and navigate to the `frontend/my-app/` directory. Execute the following commands:
```
npm install
npm start
```
`npm install` will install the needed dependencies for the frontend code of the software. `npm start` will start up the web application.

The web app will open in your browser at the url `http://localhost:3000/`. If the user has yet to log in, you will be directed to `http://localhost:3000/login`. If the app does not automatically open in your browser, you can enter the url `http://localhost:3000/` directly in your browser.

Please ensure you use Chrome, Firefox, or Safari for your browser. See [Supported Browsers Configuration](#Supported-Browsers-Configuration) if you wish to configure what browsers the web app can open in.

### Instructions for Running the App after First Installation and Setup
After installation of all required dependencies and setup of the database, you can simply follow these instructions to open the web app.

1. Open a separate terminal, ensure you are in the root directory of the project code and execute:
```
python3 -m backend.src.server
```
2. Open a separate terminal and navigate to the `frontend/my-app directory`. Execute the following command:
```
npm start
```
The web application will open in your browser at the url `http://localhost:3000/` or you may be directed to `http://localhost:3000/login`.

### Running the Server
To run the server, in the root directory, execute:
```
python3 -m backend.src.server
```
If you get an OSError saying the address is already in use, in `backend/src/server.py` change `PORT` to use a different port number.

Please ensure you have Flask installed to run the server. If not, please execute `pip3 install -r requirements.txt` in the `backend/` directory to install all the required dependencies.

### Supported Browsers Configuration
By default, the supported browsers for this web application are:
- Chrome
- Firefox
- Safari

If you wish to configure the supported browsers for the web app, you can navigate to `frontend/my-app/` and add your desired browser to `browserslist` in `package.json`.

**e.g. Adding Edge as a supported browser**

Find `package.json` in the `frontend/my-app/` directory

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

## Documentation  
Including this README.md, there are README.mds in each subdirectory of this repository that also detail installation and/or setup and also describe the structure of the code. You can find them in their respective directories:
- [backend/](./backend/)
- [database/](./database/)
- [frontend/](./frontend/)
