# Keewe test frontend

## Installation

Import the project in your current repository:

### `git clone https://github.com/maxou75/keewe-test-backend.git`

In the project directory, install the dependencies with:

### `npm install`

Then run the server:

### `PORT=8000 npm start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

## Conception

I used a basic React template from UI/UX for speed and efficiency (cf. https://github.com/mui/material-ui/tree/v5.14.18/docs/data/material/getting-started/templates/dashboard)
I choose to use MUI for UI components. I also have a router with 3 pages for the 3 core features:
- Conversions
- Payment
- Payments history

For each component, I used Axios API requests to get the necessary data at initialization. For the conversions and the payment page, there are forms that allows you to fill required data before validating. Validation will be a Post to the backend api.
For the history, I get all the payments from backend and display them into a table.
The bank data info in the payment are encrypted before being sent using CryptoJS and a simple key `secret_key`.