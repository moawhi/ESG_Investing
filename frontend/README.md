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
- `my-app/` directory: Contains all the source files required for the application. Also contains configuration files.
    - `public/` directory: Contains static assets. Has the main index.html
    - `src/` directory:
        - `components/` directory: This directory contains the code and logic for the components in all the page of the webapp.
          - `AccountManagement` directory:  Contains components to do with logging in and registering.
            - `Login.jsx`: Handles frontend logic for logging in and styling of the login page
            - `Register.jsx`: Handles frontend logic for registering and styling of the register page
          - `Topbar` directory: contains components rendered on the topbar, present on all pages after logging in.
            - `AccountMenujsx`: Handles frontend logic and styling for the account menu displayed after clicking on the account icon.
            - `Logojsx`: Handles logic and styling for the logo.
            - `Topbarjsx`: Renders the logo, platform name and account icon.
          - `CompanyInfo` directory: contains components rendered on the company_info page.
            - `AddMetricPopupjsx`: Handles frontend logic and styling for adding new metrics.
            - `ChangeWeightPopupjsx`: Handles frontend logic and styling for changing metric and indicator weights.
            - `CompanyDetailsjsx` Handles frontend logic and styling for fetching and displaying the relevant company information.
            - `CompanyInfojsx`: Displays the CompanyDetails, FrameworkSelection and MetricAccordion components on the same company_info page.
            - `FrameworkSelectionjsx`: Handles the frontend logic and styling for fetching, displaying and selecting frameworks.
            - `InvestDialog.jsx`: Handles frontend logic and styling for adding a new company to the user's portfolio.
            - `MetricAccordion.jsx`: Handles frontend logic and styling for fetching and displaying metrics, indicators, as well as calculating the adjusted ESG score.
          - `Dashboard` directory: Contains components related to the Dashboard page
            - `Dashboar.jsx`: Index component handling logic and style for the dashboard page.
            - `CompanyCard.jsx`: Styled card displaying company infor (name, ESG rating and Indutry ranking).
          - `Portfolio` directory: Contains the components related to the portfolio.
            - `DeleteDialog.jsx`: Popup dialog handle style and frontend logic delete company from portfolio.
            - `EditDialog.jsx`: Popup dialog hanles style and frontend logic edit investment detail of company in the portfolio.
            - `ESGScoreChart.jsx`: Bar chart showing esg rating and ESG score base on all frameworks of all company in the portfolio.
            - `InvestmentPieChart.jsx`: Donut chart showing propotion of invest in each company relative to total investment.
            - `Portfolio.jsx`: Index components composing of all small components for the portfolio page.
          - `Profile` directory: contains the components rendered on the profile page.
            - `Profile.jsx`: Index component fetching user details and pass on to child component in the directory
            - `GeneralInformation.jsx`: Form component diplaying user information.
            - `ImgMediaCard.jsx`: Card component display user avatar.
            - `UpdatePasswordDialog.jsx`: PopUp dialog handles frontend logic and style when update user password.
            - `UserContext.jsx`: Saving User infor into a React State to share in between components.
          - `helper.js`: fetch function using in multiple components.
        - `PageList.jsx`: Routing all the components with their associate path.
        - `App.jsx`: Index components wraping PageList.jsx.
## Running the Web App
To run the web app, ensure you are in the `frontend/my-app/` directory and execute:
```
npm start
```
The web app will open in your browser at `http://localhost:3000/`. If the app does not automatically open in your browser, you can enter the url `http://localhost:3000/` directly in your browser. If the user has yet to log in, you will be directed to `http://localhost:3000/login`. Please ensure you use Chrome, Firefox, or Safari as your browser. If you wish to use other browsers, please see [Supported Browsers Configuration](#Supported-Browsers-Configuration).

## Supported Browsers Configuration
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

