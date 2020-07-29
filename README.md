# [iFinvest](https://ifinvest.netlify.app/)

### Overview
iFinvest is a full stack web application for tracking personal investment portfolios. It is deployed via Heroku and Netlify and it lives [here](https://ifinvest.netlify.app/)!

### Features
- Designed with Material UI and is mobile ready
- Makes use of valid and current market values via _IEX API_
- Autocomplete to find and fill in ticker symbols
- Computes and generates an interactive chart with return of investments  

### Typical Use
- Log in/register from Home page
- Create new portfolios to group and hold your collections of investments
- Add any investments you would like to track or explore (currently supports US exchanges)
- Explore and analyze returns on your portfolios

### Technology
- Language - JavaScript  
- Backend - Node, Express, Postgres
- Frontend - React, Redux, Material UI, CSS, AJAX

### Testing
Backend  
Tests are located at `backend/__tests__` and can be executed with `npm test`.

Frontend  
Tests are located by each component at `frontend/src/components` and can be executed with `npm test`.

### Third Party API
- [IEX Cloud](https://iexcloud.io/)