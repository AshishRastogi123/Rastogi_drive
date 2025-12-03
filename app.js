const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app=express();
const routes = require('./routes/user.routes');

const connectoDB=require('./config/db');
connectoDB();

const cookieParser=require("cookie-parser")
const indexRoutes = require('./routes/index.routes');

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(cookieParser())
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use('/', indexRoutes); //it's mean that for the root path use indexRoutes
//we not need to use it throuh the user route because in indexRoutes we already defined the /home route
app.use('/user', routes); // Use the user routes for /user path

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app; // Export the app for testing or further configuration