const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const routes = require('./routes/user.routes');

const connectoDB = require('./config/db');
connectoDB();

const cookieParser = require("cookie-parser");
const indexRoutes = require('./routes/index.routes');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use('/', indexRoutes); // Use indexRoutes for the root path
app.use('/user', routes); // Use the user routes for /user path

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app; // Export the app for testing or further configuration
