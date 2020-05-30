/* #################################
 Filename: server.js
 Project: CS 340 Final Project
 Date: 5/14/2020
 ################################### */

var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var fs = require("fs");
var mysql = require("./dbcon.js");

var app = express();

var port = process.env.PORT || 3000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

// Catch for login page
app.get("/", function (req, res, next) {
  res.status(200).render("loginPage");
});

// Catch for links page
app.get("/links", function (req, res, next) {
  res.status(200).render("linksPage");
});

// Catch for home page
app.get("/home", function (req, res, next) {
  res.status(200).render("homePage");
});

// Catch for view page
app.get("/view/bird/", function (req, res, next) {
  mysql.pool.query("SELECT * FROM bird", (err, rows) => {
    if (err) {
      console.error(err);
      next();
    } else {
      res.status(200).render("viewAllBirdPage", { birds: rows });
    }
  });
});

// Catch for view page
app.get("/view/bird/:id", function (req, res, next) {
  mysql.pool.query(
    "SELECT * FROM bird WHERE id=" + req.params.id,
    (err, rows) => {
      if (err || rows.length == 0) {
        console.error(err);
        next();
      } else {
        console.table(rows[0]);
        res.status(200).render("viewBirdPage", { bird: rows[0] });
      }
    }
  );
});

// Catch for view page
app.get("/view/subject/", function (req, res, next) {
  mysql.pool.query(
    "SELECT * FROM subject, subject_address WHERE subject.id=subject_address.subject_id",
    (err, rows) => {
      if (err) {
        console.error(err);
        next();
      } else {
        console.table(rows);
        res.status(200).render("viewAllSubjectPage", { subjects: rows });
      }
    }
  );
});

// Catch for view page
app.get("/view/subject/:id", function (req, res, next) {
  mysql.pool.query(
    "SELECT * FROM subject, subject_address WHERE subject.id=" +
      req.params.id +
      " && subject.id=subject_address.subject_id",
    (err, rows) => {
      if (err || rows.length == 0) {
        console.error(err);
        next();
      } else {
        res.status(200).render("viewSubjectPage", { subject: rows[0] });
      }
    }
  );
});

app.get("/search/*", function (req, res, next) {
  res.status(200).render("homePage");
});

// Testing sql
app.get("/test", function (req, res, next) {});

// Catch all other requests
app.get("*", function (req, res) {
  res.status(404).render("404");
});

// Port Listener
app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
