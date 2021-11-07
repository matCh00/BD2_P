const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


// dane do serwera MySQL
const mysql = require("mysql");
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '162534',
    database: 'database_course',
});


app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));


// przesłanie danych z backendu do frontendu
app.get("/api/get", (req, res) => {

    const sqlSelect = "SELECT * FROM movie_reviews";

    db.query(sqlSelect, (err, result) => {
        
        // i wyświetlenie
        res.send(result);
    });
});


// zapis danych ze strony w bazie danych
app.post("/api/insert", (req, res) => {

    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert = 
    "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)";

    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        console.log(result);
    });
});



// przykładowe wysłanie danych do bazy
/*
app.get("/", (req, res) => {

    const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES ('pierwsze', 'drugie');";
    db.query(sqlInsert, (err, result) => {
        res.send("hello");
    });
});
*/


// nasłuchiwanie
app.listen(3001, () => {
    console.log("running on port 3001");
});