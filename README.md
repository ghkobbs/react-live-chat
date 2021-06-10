# Introduction
A simple real time chat application built with React and Redux for the frontend and NodeJS for the backend and [socket.io](https://socket.io) to update conversation in real time.

Demo can be found at [https://bgrint-livechat.herokuapp.com/](https://bgrint-livechat.herokuapp.com/).

## Development
The backend codes are located inside the `root` of the folder.
The client/frontend codes are located inside the `client` folder.

### Install Dependencies
Run the following commands in your terminal. Make sure you're inside the project root folder.
```js
npm run client-install
```
>To install the client dependencies
```js
npm install
```
>To install the nodejs server dependencies

### `npm run client`

Runs the client/frontend app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run server`

Runs the backend node server in the development mode.
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run dev`

Runs both the frontend and backend node server concurrently in the development mode.
Open [http://localhost:3000](http://localhost:3000) to it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Production
App can be deployed using heroku. More info on that [here](https://devcenter.heroku.com/articles/git)

The following environment variables are required to run in production.
|  Variable |  Description | Required
|---|---|---|
|MONGO_DB_URI| Atlas mongoDB connection string | Yes
|JWT_SECRET_KEY|Any random characters. Will be used to sign JWT session|Yes
|AUTHO_DOMAIN|Auth0 domain. Can be found in the settings area of your auth0 app.|Yes
|CLIENT_ID|Auth0 Client ID. Can be found in the settings area of your auth0 app.|Yes
|CLIENT_SECRET|Auth0 Client Secret. Can be found in the settings area of your auth0 app.|Yes
|REDIRECT_URI|Auth0 Callback Url. Can be found in the settings area of your auth0 app.|Yes

>Note: Make sure to update the same information in `client -> config -> default.js` file.

# Thank you 🙏