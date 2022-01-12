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

    const sqlSelect = "SELECT * FROM movies";

    db.query(sqlSelect, (err, result) => {
        
        if (err) {
            res.send("error");
            return;
        }

        // i wyświetlenie
        res.send(result);
    });
});



// filtrowanie listy filmów 
app.put("/api/filter", (req, res) => {

    const movieType = req.body.movieType;

    if (movieType.length == 0) {

        var count;

        // zwrócenie liczby elementów
        const sqlSelect = "SELECT COUNT(*) AS cnt FROM movies"

        db.query(sqlSelect, (err, resulttt) => {     

            count = resulttt[0].cnt;

            // wyświetlenie wszystkich filmów
            const sqlSelect2 = "SELECT * FROM movies";

            db.query(sqlSelect2, (err, result) => {
            
                res.send({list: result, counter: count});
            });
        });
    }
    else {
        var count;

        // zwrócenie liczby wybranych elementów
        const sqlSelect = "SELECT COUNT(*) AS cnt FROM movies WHERE type LIKE ?"

        db.query(sqlSelect, movieType, (err, resultt) => {    

            count = resultt[0].cnt;

            // wyświetlenie wybranych
            const sqlSelect2 = "SELECT * FROM movies WHERE type = ?";

            db.query(sqlSelect2, movieType, (err, result) => {
            
                res.send({list: result, counter: count});
            });
        });
    }
});



// dodawanie filmu
app.post("/api/insert", (req, res) => {

    const movieName = req.body.movieName;
    const movieRating = req.body.movieRating;
    const movieType = req.body.movieType;
    const movieYear = req.body.movieYear;

    const sqlInsert = "INSERT INTO movies (movieName, rating, type, year, rented) VALUES (?,?,?,?,?)";

    db.query(sqlInsert, [movieName, movieRating, movieType, movieYear, false], (err, result) => {
        console.log(result);
    });
});



// usuwanie filmu
app.post("/api/delete", (req, res) => {

    const movieName = req.body.movieName;
  
    // zwrócenie liczby wierszy z podaną nazwą
    const sqlSelect = "SELECT COUNT(*) AS cnt FROM movies WHERE movieName LIKE ?"

    db.query(sqlSelect, movieName, (err, result) => {
            
        // wartość zwracana komendą SQL
        if (result[0].cnt > 0) {

            const sqlDelete = "DELETE FROM movies WHERE movieName = ?";
  
            db.query(sqlDelete, movieName, (err, result) => {
                if (err) console.log(err);
            });

            res.send({message: "OK: Usunięto"});
        }
        else {
            res.send({message: "Error: Nie ma takiego filmu"});
        }
    });
  });



// aktualizowanie oceny filmu
app.put("/api/update", (req, res) => {

    const name = req.body.movieName;
    const movieRating = req.body.movieRating;

    // zwrócenie liczby wierszy z podaną nazwą
    const sqlSelect = "SELECT COUNT(*) AS count FROM movies WHERE movieName LIKE ?"

    db.query(sqlSelect, name, (err, result) => {
            
        // wartość zwracana komendą SQL
        if (result[0].count > 0) {

            const sqlUpdate = "UPDATE movies SET rating = ? WHERE movieName = ?";

            db.query(sqlUpdate, [movieRating, name], (err, result) => {
                if (err) console.log(err);
            });

            res.send({message: "OK: Zaktualizowano"});
        }
        else {
            res.send({message: "Error: Nie ma takiego filmu"});
        }
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

        // zwrócenie liczby wierszy z podanym loginem
        const sqlSelect = "SELECT COUNT(*) AS cnt FROM login_password WHERE login LIKE ?"

        db.query(sqlSelect, login, (err, result) => {
            
            // wartość zwracana komendą SQL
            if (result[0].cnt == 0) {

                // dodanie użytkownika do bazy
                const sqlInsert = "INSERT IGNORE INTO login_password (login, password) VALUES (?,?)";

                db.query(sqlInsert, [login, hash], (err, result) => {
                    console.log(result);
                });

                res.send({message: "OK: Dodano użytkownika"});
            }
            else {
                res.send({message: "Error: Użytkownik już istnieje"});
            }
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
                        res.send({message: "Error: Złe hasło"});
                    }
                });
            }
            else {
                res.send({message: "Error: Urzytkownik nie istnieje"});
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



// dodawanie wypożyczenia
app.post("/api/rent", (req, res) => {

    const movieName = req.body.movieName;
    const dateBegin = req.body.dateBegin;
    const dateEnd = req.body.dateEnd;
    const login = req.body.login;


    // zwrócenie liczby filmów z podaną nazwą
    const sqlSelect = "SELECT COUNT(*) AS cnt FROM movies WHERE movieName LIKE ?"

    db.query(sqlSelect, movieName, (err, result) => {

        // wartość zwracana komendą SQL
        if (result[0].cnt != 0) {

            // sprawdzenie czy film jest już wypożyczony
            const sqlSelect = "SELECT rented FROM movies WHERE movieName LIKE ?"

            db.query(sqlSelect, movieName, (err, result) => {

                // wartość pola rented
                if (result[0].rented == 0) {

                    const sqlInsert = "INSERT INTO movie_rentals (movieName, dateBegin, dateEnd, userLogin) VALUES (?,?,?,?)";

                    db.query(sqlInsert, [movieName, dateBegin, dateEnd, login], (err, resulttt) => {

                        if(resulttt) {

                            // ustawienie statusu filmu w tabeli na wypożyczony
                            const sqlUpdate = "UPDATE movies SET rented = true WHERE movieName = ?";

                            db.query(sqlUpdate, movieName, (err, result) => {
                                if (result) console.log(result);
                            });
                            
                            res.send({message: "OK: Dodano wypożyczenie"});
                        }
                        else {
                            res.send({message: "Error: Podaj datę"});
                        }
                    });
                }
                else {
                    res.send({message: "Error: Film jest już wypożyczony"});
                }
            });
        }
        else {
            res.send({message: "Error: Nie ma takiego filmu"});
        }
    });
});



// odebranie filmu
app.put("/api/pickup", (req, res) => {

    const movieName = req.body.movieName;

    // zwrócenie liczby filmów z podaną nazwą
    const sqlSelect = "SELECT COUNT(*) AS cnt FROM movies WHERE movieName LIKE ?"

    db.query(sqlSelect, movieName, (err, result) => {

        // wartość zwracana komendą SQL
        if (result[0].cnt != 0) {

            // sprawdzenie czy film jest wypożyczony
            const sqlSelect = "SELECT rented FROM movies WHERE movieName LIKE ?"

            db.query(sqlSelect, movieName, (err, result) => {

                // wartość pola rented
                if (result[0].rented == 1) {

                    // ustawienie statusu filmu w tabeli na niewypożyczony
                    const sqlUpdate = "UPDATE movies SET rented = false WHERE movieName = ?";

                    db.query(sqlUpdate, movieName, (err, result) => {
                        if (result) console.log(result);
                    });

                    res.send({message: "OK: Odebrano film"});
                }
                else {
                    res.send({message: "Error: Film nie jest wypożyczony"});
                }
            });    
        }
        else {
            res.send({message: "Error: Nie ma takiego filmu"});
        }
    });
});