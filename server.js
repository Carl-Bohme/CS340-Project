/* #################################
 Filename: server.js
 Project: CS 340 Final Project
 Date: 5/14/2020
 ################################### */

var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var fs = require('fs');


var app = express();

var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));


// Catch for login page
app.get('/', function (req, res, next) {
    res.status(200).render('loginPage');
});


// Catch for home page
app.get('/home', function (req, res, next) {
    res.status(200).render('homePage');
});

app.get('/search/*', function (req, res, next) {
    res.status(200).render('homePage');
});

// Catch all other requests
app.get('*', function (req, res) {
    res.status(404).render('404');
});


// Port Listener
app.listen(port, function () {
    console.log("== Server is listening on port", port);
});