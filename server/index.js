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


// usuwanie recenzji
app.delete(`/api/delete/:movieName`, (req, res) => {

    const name = req.params.movieName;

    const sqlDelete = 
    "DELETE FROM movie_reviews WHERE movieName = ?";

    db.query(sqlDelete, name, (err, result) => {
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


// nasłuchiwanie
app.listen(3001, () => {
    console.log("running on port 3001");
});




const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');

// podświetlanie elementów na pasku gdy scrollujemy
const highlightMenu = () => {
  const elem = document.querySelector('.highlight');
  const listMenu = document.querySelector('#list-page');
  const borrowMenu = document.querySelector('#borrow-page');
  const manageMenu = document.querySelector('#manage-page');
  let scrollPos = window.scrollY;


  // dodanie i usuwanie podświetleń
  if (window.innerWidth > 960 && scrollPos < 600) {
    listMenu.classList.add('highlight');
    borrowMenu.classList.remove('highlight');
    return;
  } 
  else if (window.innerWidth > 960 && scrollPos < 1400) {
    borrowMenu.classList.add('highlight');
    listMenu.classList.remove('highlight');
    manageMenu.classList.remove('highlight');
    return;
  } 
  else if (window.innerWidth > 960 && scrollPos < 2345) {
    manageMenu.classList.add('highlight');
    borrowMenu.classList.remove('highlight');
    return;
  }

  if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
    elem.classList.remove('highlight');
  }
};

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);