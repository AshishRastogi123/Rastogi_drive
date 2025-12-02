const express = require('express');
const app=express();
const routes = require('./routes/user.routes');

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use('/user', routes); // Use the user routes for /user path

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app; // Export the app for testing or further configuration