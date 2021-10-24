const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


// do bazy danych
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


// pobieranie ze strony i zapis w bazie danych
app.post("/api/insert", (req, res) => {

    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert = 
    "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)"

    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        console.log(result);
    });
});



app.get("/", (req, res) => {

    const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES ('pierwsze', 'drugie');";
    db.query(sqlInsert, (err, result) => {
        res.send("hello");
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});