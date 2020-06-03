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
var session = require("express-session");

var app = express();

var port = process.env.PORT || 3000;

const SESSION_NAME = "sid";

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session Setup
app.use(
  session({
    name: SESSION_NAME,
    secret: "thisIsTheSecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);

// Function to provide subjects and stations for modals
function provideUniversalData() {
  data = {};
  mysql.pool.query("SELECT name FROM station", function (err, results) {
    if (err) {
      res.write(JSON.stringify(err));
      res.end();
    }
    data.stations = results;
  });
  mysql.pool.query("SELECT name, id FROM subject", function (err, results) {
    if (err) {
      res.write(JSON.stringify(err));
      res.end();
    }
    data.subjects = results;
  });
  return data;
}

// Redirects user to login if they are not logged in
const redirectToLogin = (req, res, next) => {
  if (!req.session.codename) {
    res.redirect("/");
  } else {
    next();
  }
};

// Redirects user to home if they are logged in
const redirectToHome = (req, res, next) => {
  if (req.session.codename) {
    res.redirect("/home");
  } else {
    next();
  }
};

// Catch for login page
app.get("/", redirectToHome, function (req, res, next) {
  res.status(200).render("loginPage");
});

// Catch for login post
app.post("/login", redirectToHome, function (req, res, next) {
  if (req.body.username && req.body.password) {
    mysql.pool.query(
      "SELECT username, password, codename FROM handler WHERE username='" +
        req.body.username +
        "' AND password='" +
        req.body.password +
        "'",
      (err, results) => {
        if (err) {
          console.error(err);
          next();
        } else {
          if (results.length == 1) {
            req.session.codename = results[0].codename;
            console.log("User codename: " + req.session.codename);
            res.redirect("/home");
          } else {
            console.log("invalid login attempt");
          }
        }
      }
    );
  }
});

// Catch for logout post
app.post("/logout", redirectToLogin, function (req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      res.redirect("/home");
    } else {
      res.clearCookie(SESSION_NAME);
      res.redirect("/");
    }
  });
});

// Catch for links page
app.get("/links", function (req, res, next) {
  res.status(200).render("linksPage");
});

// Catch for home page
app.get("/home", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT * FROM bird INNER JOIN bird_ownership ON bird.id = bird_ownership.bird_id INNER JOIN subject ON bird.subject_id=subject.id WHERE handler_codename='" +
      req.session.codename +
      "'",
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        data.birds = results;
        res.status(200).render("homePage", { data });
      }
    }
  );
});

// Catch for view birds page
app.get("/view/bird/", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT bird.id, bird.production_date, bird.race, bird.subject_id, subject.name FROM bird INNER JOIN subject ON bird.subject_id = subject.id",
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        data.birds = results;
        res.status(200).render("viewAllBirdPage", { data });
      }
    }
  );
});

// Catch for view individual bird page
app.get("/view/bird/:id", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT * FROM handler INNER JOIN bird_ownership ON handler.codename = bird_ownership.handler_codename WHERE bird_id =" +
      req.params.id,
    function (err, results) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      data.handlers = results;
    }
  );
  mysql.pool.query(
    "SELECT bird.id, bird.production_date, bird.race, bird.subject_id, subject.name FROM bird INNER JOIN subject ON bird.subject_id = subject.id WHERE bird.id=" +
      req.params.id,
    (err, results) => {
      if (err || results.length == 0) {
        console.error(err);
        next();
      } else {
        data.bird = results[0];
        res.status(200).render("viewBirdPage", { data });
      }
    }
  );
});

// Catch for view subject page
app.get("/view/subject/", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT * FROM subject, subject_address WHERE subject.id=subject_address.subject_id ORDER BY subject.id ASC",
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        data.subjects = results;
        res.status(200).render("viewAllSubjectPage", { data });
      }
    }
  );
});

// Catch for view individual subject page
app.get("/view/subject/:id", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT * FROM bird WHERE subject_id ='" + req.params.id + "'",
    function (err, results) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      data.birds = results;
    }
  );
  mysql.pool.query(
    "SELECT * FROM subject, subject_address WHERE subject.id=" +
      req.params.id +
      " && subject.id=subject_address.subject_id",
    (err, results) => {
      if (err || results.length == 0) {
        console.error(err);
        next();
      } else {
        data.subjects = results;
        data.subject = results[0];
        res.status(200).render("viewSubjectPage", { data });
      }
    }
  );
});

// Catch for view stations page
app.get("/view/station/", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query("SELECT * FROM coordinates", (err, results) => {
    if (err) {
      console.error(err);
      next();
    } else {
      data.coords = results;
      res.status(200).render("viewAllStationPage", { data });
    }
  });
});

// Catch for view individual station page
app.get("/view/station/:station_name", redirectToLogin, function (
  req,
  res,
  next
) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT handler.codename, nbr, street, city FROM handler INNER JOIN handler_address ON handler.codename = handler_address.codename WHERE station='" +
      req.params.station_name +
      "'",
    function (err, results) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      data.handlers = results;
    }
  );
  mysql.pool.query(
    "SELECT * FROM coordinates WHERE station_name='" +
      req.params.station_name +
      "'",
    (err, results) => {
      if (err || results.length == 0) {
        console.error(err);
        next();
      } else {
        data.station = results[0];
        res.status(200).render("viewStationPage", { data });
      }
    }
  );
});

// Catch for view handlers page
app.get("/view/handler/", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT * FROM handler, handler_address WHERE handler.codename=handler_address.codename ORDER BY station",
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        data.handlers = results;
        res.status(200).render("viewAllHandlerPage", { data });
      }
    }
  );
});

// Catch for view individual handler page
app.get("/view/handler/:codename", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "SELECT * FROM bird INNER JOIN bird_ownership ON bird.id = bird_ownership.bird_id WHERE handler_codename='" +
      req.params.codename +
      "'",
    function (err, results) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      data.birds = results;
    }
  );
  mysql.pool.query(
    "SELECT * FROM handler, handler_address WHERE handler.codename=handler_address.codename && handler.codename='" +
      req.params.codename +
      "'",
    (err, results) => {
      if (err || results.length == 0) {
        console.error(err);
        next();
      } else {
        data.handler = results[0];
        res.status(200).render("viewHandlerPage", { data });
      }
    }
  );
});

app.get("/search/*", redirectToLogin, function (req, res, next) {
  res.redirect("/home");
});

// Add Subject Post Handler
app.post("/CreateSubject", redirectToLogin, function (req, res, next) {
  console.log(req.body);
  var sql = "INSERT INTO subject (name) VALUES (?)";
  var inserts = [req.body.name];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) {
      console.log(JSON.stringify(error));
      res.write(JSON.stringify(error));
      res.end();
    } else {
      var sql =
        "INSERT INTO subject_address (subject_id, nbr, street, city) VALUES ((SELECT MAX(id) FROM subject),?,?,?)";
      var inserts = [req.body.nbr, req.body.street, req.body.city];
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
        } else {
          res.redirect("/view/subject");
        }
      });
    }
  });
});

// Add Bird Post Handler
app.post("/CreateBird", redirectToLogin, function (req, res, next) {
  console.log(req.body);

  var sql =
    "INSERT INTO bird (production_date, race, subject_id) VALUES (?,?,?)";
  var inserts = [req.body.production_date, req.body.race, req.body.subject_id];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) {
      console.log(JSON.stringify(error));
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/view/bird");
    }
  });
});

// Add Handler Post Handler
app.post("/CreateHandler", redirectToLogin, function (req, res, next) {
  console.log(req.body);

  var sql = "SELECT * FROM handler WHERE codename='" + req.body.codename + "'";
  sql = mysql.pool.query(sql, function (error, results, fields) {
    if (results.length >= 1) {
      console.log("Invalid Codename"); // Need to display to user that codename is invlaid
    } else {
      var sql =
        "SELECT * FROM handler WHERE username='" + req.body.username + "'";
      sql = mysql.pool.query(sql, function (error, results, fields) {
        if (results.length >= 1) {
          console.log("Invalid Username"); // Need to display to user that username is invlaid
        } else {
          var sql =
            "SELECT * FROM station WHERE name='" + req.body.station + "'";
          sql = mysql.pool.query(sql, function (error, results, fields) {
            if (results.length < 1) {
              console.log("Station does not exist."); // Need to display to user that station is invlaid
            } else {
              var sql =
                "INSERT INTO handler (codename, username, password, station) VALUES (?,?,?,?)";
              var inserts = [
                req.body.codename,
                req.body.username,
                req.body.password,
                req.body.station,
              ];
              sql = mysql.pool.query(sql, inserts, function (
                error,
                results,
                fields
              ) {
                if (error) {
                  console.log(JSON.stringify(error));
                  res.write(JSON.stringify(error));
                  res.end();
                } else {
                  var sql =
                    "INSERT INTO handler_address (codename, nbr, street, city) VALUES (?,?,?,?)";
                  var inserts = [
                    req.body.codename,
                    req.body.nbr,
                    req.body.street,
                    req.body.city,
                  ];
                  sql = mysql.pool.query(sql, inserts, function (
                    error,
                    results,
                    fields
                  ) {
                    if (error) {
                      console.log(JSON.stringify(error));
                      res.write(JSON.stringify(error));
                      res.end();
                    } else {
                      res.redirect("/view/handler");
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// Add Station Post Handler
app.post("/CreateStation", redirectToLogin, function (req, res, next) {
  console.log(req.body);

  var sql = "SELECT * FROM station WHERE name='" + req.body.name + "'";
  sql = mysql.pool.query(sql, function (error, results, fields) {
    if (results.length >= 1) {
      console.log("Invalid Name"); // Need to display to user that Name is invlaid
    } else {
      var sql = "INSERT INTO station (name) VALUES (?)";
      var inserts = [req.body.name];
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
        } else {
          var sql =
            "INSERT INTO coordinates (station_name, latitude, longitude) VALUES (?,?,?)";
          var inserts = [req.body.name, req.body.latitude, req.body.longitude];
          sql = mysql.pool.query(sql, inserts, function (
            error,
            results,
            fields
          ) {
            if (error) {
              console.log(JSON.stringify(error));
              res.write(JSON.stringify(error));
              res.end();
            } else {
              res.redirect("/view/station");
            }
          });
        }
      });
    }
  });
});

// Catch for delete bird
app.delete("/deleteBird/:id", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    "DELETE FROM bird WHERE id=" + req.params.id,
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        res.status(200).send("success");
      }
    }
  );
});

// Catch for delete handler
app.delete("/deleteHandler/:codename", redirectToLogin, function (
  req,
  res,
  next
) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    `DELETE a.*, b.* 
    FROM handler_address a 
    LEFT JOIN handler b 
    ON b.codename = a.codename 
    WHERE a.codename="${req.params.codename}"`,
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        res.status(200).send("success");
      }
    }
  );
});

// Catch for delete subject
app.delete("/deleteSubject/:id", redirectToLogin, function (req, res, next) {
  data = provideUniversalData();
  data.codename = req.session.codename;
  mysql.pool.query(
    `DELETE a.*, b.* 
      FROM subject_address a 
      LEFT JOIN subject b 
      ON b.id = a.subject_id 
      WHERE a.subject_id=${req.params.id}`,
    (err, results) => {
      if (err) {
        console.error(err);
        next();
      } else {
        res.status(200).send("success");
      }
    }
  );
});

// Catch all other requests
app.get("*", redirectToLogin, function (req, res) {
  res.status(404).render("404");
});

// Port Listener
app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
