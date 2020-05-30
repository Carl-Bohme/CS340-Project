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
app.use(bodyParser.urlencoded({extended:true}));
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



// Add Subject Post Handler
app.post('/CreateSubject', function(req, res, next){
  console.log(req.body);
  var sql = "INSERT INTO subject (name) VALUES (?)";
  var inserts = [req.body.name];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
        var sql = "INSERT INTO subject_address (subject_id, nbr, street, city) VALUES ((SELECT MAX(id) FROM subject),?,?,?)";
        var inserts = [req.body.nbr,req.body.street,req.body.city];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{ res.redirect('/view/subject') };
        });
      }
  });
});


// Add Bird  Post Handler
app.post('/CreateBird', function(req, res, next){
  console.log(req.body);

  var sql = "SELECT * FROM subject WHERE id='" + req.body.subject_id + "'";
  sql = mysql.pool.query(sql,function(error, results, fields){
    if(results.length < 1){
      console.log("Invalid Subject ID"); // Need to display to user that subject id is invlaid
    } else {

      var sql = "INSERT INTO bird (production_date, race, subject_id) VALUES (?,?,?)";
      var inserts = [req.body.production_date, req.body.race, req.body.subject_id];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/view/bird');
          }
      });

    }
  });

});


// Add Handler Post Handler
app.post('/CreateHandler', function(req, res, next){
  console.log(req.body);

  var sql = "SELECT * FROM handler WHERE codename='" + req.body.codename + "'";
  sql = mysql.pool.query(sql,function(error, results, fields){
    if(results.length >= 1){
      console.log("Invalid Codename"); // Need to display to user that codename is invlaid
    } else {

      var sql = "SELECT * FROM handler WHERE username='" + req.body.username + "'";
      sql = mysql.pool.query(sql,function(error, results, fields){
        if(results.length >= 1){
          console.log("Invalid Username"); // Need to display to user that username is invlaid
        } else {

          var sql = "INSERT INTO handler (codename, username, password, station) VALUES (?,?,?,?)";
          var inserts = [req.body.codename,req.body.username,req.body.password,req.body.station];
          sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{

              var sql = "INSERT INTO handler_address (codename, nbr, street, city) VALUES (?,?,?,?)";
              var inserts = [req.body.codename,req.body.nbr,req.body.street,req.body.city];
              sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                  if(error){
                      console.log(JSON.stringify(error))
                      res.write(JSON.stringify(error));
                      res.end();
                  }else{ res.redirect('/view/handler') };
              });
            
            }
          });

        }
      });

    }
  });

});


// Add Station Post Handler
app.post('/CreateStation', function(req, res, next){
  console.log(req.body);

  var sql = "SELECT * FROM station WHERE name='" + req.body.name + "'";
  sql = mysql.pool.query(sql,function(error, results, fields){
    if(results.length >= 1){
      console.log("Invalid Name"); // Need to display to user that Name is invlaid
    } else {
      var sql = "INSERT INTO station (name) VALUES (?)";
      var inserts = [req.body.name];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
          var sql = "INSERT INTO coordinates (station_name, latitude, longitude) VALUES (?,?,?)";
          var inserts = [req.body.name,req.body.latitude,req.body.longitude];
          sql = mysql.pool.query(sql,inserts,function(error, results, fields){
              if(error){
                  console.log(JSON.stringify(error))
                  res.write(JSON.stringify(error));
                  res.end();
              }else{ res.redirect('/view/station') };
          });
        }
      });
    }
  });
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
