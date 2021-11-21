const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// bezpieczeństwo - haszowanie haseł w bazie danych
const bcrypt = require('bcrypt');
const saltRounds = 10;

// serwer MySQL
const mysql = require("mysql");
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '162534',
    database: 'database_course',
});


app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    session ({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUnitialized: false,
        cookie: {
            expires: 60 * 60 * 24
        }
    })
);



// nasłuchiwanie
app.listen(3001, () => {
    console.log("running on port 3001");
});



// wyświetlanie listy filmów 
app.get("/api/get", (req, res) => {

    const sqlSelect = "SELECT * FROM movie_reviews";

    db.query(sqlSelect, (err, result) => {
        
        // i wyświetlenie
        res.send(result);
    });
});



// dodawanie filmu wraz z opinią
app.post("/api/insert", (req, res) => {

    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert = 
    "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)";

    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        console.log(result);
    });
});



// usuwanie filmu v1
app.delete(`/api/delete/:movieName`, (req, res) => {

    const name = req.params.movieName;

    const sqlDelete = 
    "DELETE FROM movie_reviews WHERE movieName = ?";

    db.query(sqlDelete, name, (err, result) => {
        if (err) console.log(err);
    });
});



// usuwanie filmu v2
app.post("/api/delete", (req, res) => {

    const movieName = req.body.movieName;
  
    const sqlDelete = 
    "DELETE FROM movie_reviews WHERE movieName = ?";
  
      db.query(sqlDelete, movieName, (err, result) => {
          if (err) console.log(err);
      });
  });



// aktualizowanie recenzji
app.put("/api/update", (req, res) => {

    const name = req.body.movieName;
    const review = req.body.movieReview;

    const sqlUpdate = 
    "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";

    db.query(sqlUpdate, [review, name], (err, result) => {
        if (err) console.log(err);
    });
});



// rejestracja
app.post("/api/register", (req, res) => {

    const login = req.body.login;
    const password = req.body.password;

    // haszowanie haseł
    bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) {
            console.log(err);
        }

        const sqlInsert = "INSERT IGNORE INTO login_password (login, password) VALUES (?,?)";

        db.query(sqlInsert, [login, hash], (err, result) => {
            console.log(result);
        });
    });
});



// logowanie
app.post("/api/login", (req, res) => {

    const login = req.body.login;
    const password = req.body.password;

    // sprawdzenie czy istnieje użytkownik w bazie
    const sqlSelect = "SELECT * FROM login_password WHERE login = ?";

    db.query(sqlSelect, login, (err, result) => {

        if (err) {
           res.send({err: err})
        } 
        else {

            // sprawdzenie haszowanego hasła
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {

                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);

                        res.send(result);
                    }
                    else {
                        res.send({message: "Złe hasło"});
                    }
                });
            }
            else {
                res.send({message: "Urzytkownik nie istnieje"});
            }
        }
    });
});



// odświeżanie strony po zalogowaniu
app.get("/login", (req, res) => {

    // jeżeli jest zalogowany urzytkownik
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    }
    else {
        res.send({loggedIn: false});
    }
});