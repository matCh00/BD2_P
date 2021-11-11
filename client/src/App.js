import React from "react";
import useState from "react";
import { useEffect } from "react";
import Axios from "axios";
import "./App.css";


function App() {

  // nazwa filmu (pole tekstowe)
  const [movieName, setMovieName] = React.useState("");

  // recenzja (pole tekstowe)
  const [review, setReview] = React.useState("");

  // lista filmów wraz z recenzjami
  const [movieReviewList, setMovieList] = React.useState([]);

  // nowa recenzja
  const [newReview, setNewReview] = React.useState("");



  // wyświetlanie danych na frontendzie
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setMovieList(response.data);
    });
  }, []);



  // przesłyłanie danych z frontendu (strona) do backendu (bazy danych)
  const submitReview = () => {

    Axios.post("http://localhost:3001/api/insert", {
      movieName: movieName, 
      movieReview: review
    });

    // aktualizacja bez potrzeby odświerzania strony
    setMovieList([
      ...movieReviewList, 
      {movieName: movieName, movieReview: review},
    ]);

  };



  // usuwanie rezencji
  const deleteReview = (movie) => {

    Axios.delete(`http://localhost:3001/api/delete/${movie}`);
  };



  // aktualizacja rezencji
  const updateReview = (movie) => {

    Axios.put("http://localhost:3001/api/update", {
      movieName: movie,
      movieReview: newReview,
    });
    setNewReview("");
  };



  return ( 
    <div className="App">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wypożyczalnia filmów</title>
        <link rel="stylesheet" href="styles.css" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.14.0/css/all.css"
          integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc"
          crossorigin="anonymous"/>
      </head>


      <nav class="navbar">
        <div class="navbar__container">
          <a href="#list" id="navbar__logo">Wypożyczalnia filmów</a>
          <ul class="navbar__menu">
            <li class="navbar__item">
              <a href="#list" class="navbar__links" id="list-page">Lista filmów</a>
            </li>
            <li class="navbar__item">
              <a href="#borrow" class="navbar__links" id="borrow-page">Wypożycz</a>
            </li>
            <li class="navbar__item">
              <a href="#manage" class="navbar__links" id="manage-page">Zarządzaj</a>
            </li>
            <li class="navbar__btn">
              <a href="#login" class="button" id="login-page">Zaloguj się</a>
            </li>
          </ul>
        </div>
      </nav>



      <div class="list" id="list">
        <div class="list__container">

          {movieReviewList.map((val) => {
            return (

              <div className="card">
                <h2> {val.movieName} </h2>
                <p> {val.movieReview} </p>

                <button onClick={() => {deleteReview(val.movieName)}}> Delete </button>

                <input type="text" id="updateInput" onChange={(e) => {setNewReview(e.target.value)}}/>

                <button onClick={() => {updateReview(val.movieName)}}> Update </button>

              </div>
            )
          })}

          <h1 class="list__heading"><span>Dostępne filmy</span></h1>
          <h1 class="list__heading"><span>Znajdź film</span></h1>
          <input class="input" placeholder="czego szukasz?" type="text" spellcheck="false"/>
          <button id="findButton" class="main__btn"><a href="#">Szukaj</a></button>
        </div>
      </div>



      <div class="borrow" id="borrow">
        <div class="borrow__container">
          <h1>Wypożycz film</h1>
          <button id="borrowButton" class="main__btn"><a href="#">Wypożycz</a></button>
        </div>
      </div>



      <div class="manage" id="manage">
        <div class="manage__container">
          <h1>Zarządzaj filmami</h1>
          <div>
            <button id="addButton" class="main__btn"><a href="#">Dodaj</a></button>
            <button id="deleteButton" class="main__btn"><a href="#">Usuń</a></button>
            <button id="editButton" class="main__btn"><a href="#">Edytuj</a></button>
          </div>
        </div>
      </div>



      <div class="login" id="login">
        <div class="login__container">
          <h1>Zaloguj się lub załóż konto</h1>
          <input class="input" placeholder="email" type="text" spellcheck="false"/>
          <input class="input" placeholder="hasło" type="text" spellcheck="false"/>
          <button id="loginButton" class="main__btn"><a href="#">Zaloguj się</a></button>
          <button id="registerButton" class="main__btn"><a href="#">Załóż nowe konto</a></button>
        </div>
      </div>


      <h1> Wypożyczalnia filmów </h1>   

        <div className="form">
          <label> Movie name: </label>
          <input type="text" name="movieName" onChange={(e)=> {setMovieName(e.target.value)}} />

          <label> Review: </label>
          <input type="text" name="review" onChange={(e)=> {setReview(e.target.value)}} /> 

          <button onClick={submitReview}> Submit </button>

          

        </div>
    </div>
  )
}

export default App;