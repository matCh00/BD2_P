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

  // login (pole tekstowe)
  const [login, setLogin] = React.useState("");

  // hasło (pole tekstowe)
  const [password, setPassword] = React.useState("");

  // status logowania
  const [loginStatus, setLoginStatus] = React.useState("");

  // status zarządzania filmami
  const [manageStatus, setManageStatus] = React.useState("");


  Axios.defaults.withCredentials = true;


  // wyśiwtlenie listy po odświeżeniu strony
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setMovieList(response.data);
    });
  }, []);



  // dodanie filmu z recenzją
  const submitReview = () => {

    // dodawać mogą jedynie zalogowani urzytkownicy
    if (loginStatus.length > 0) {

      Axios.post("http://localhost:3001/api/insert", {
        movieName: movieName, 
        movieReview: review
      });

      // aktualizacja bez potrzeby odświeżania strony
      setMovieList([
        ...movieReviewList, 
        {movieName: movieName, movieReview: review},
      ]);

      setManageStatus("dodano");
    }
    else {
      setManageStatus("zaloguj się");
    }
  };



  // usuwanie filmu 
  const deleteMovie = () => {

    // usuwać film może tylko admin
    if (loginStatus == "admin") {
      Axios.post("http://localhost:3001/api/delete", {movieName: movieName});
      setManageStatus("usunięto");
    }
    else {
      setManageStatus("brak uprawnień")
    }
  }



  // aktualizacja recenzji
  const editReview = () => {

    // aktualizować recenzję może tylko admin
    if (loginStatus == "admin") {

      Axios.put("http://localhost:3001/api/update", {
        movieName: movieName,
        movieReview: review
      });

      setManageStatus("zaktualizowano");
    }

    // jeżeli nie jest to admin
    else if (loginStatus.length > 0) {

      setManageStatus("brak uprawnień");
    }
    else {
      setManageStatus("zaloguj się");
    }
  };



  // rejestracja
  const registerFunction = () => {

    setLoginStatus(" ");

    Axios.post("http://localhost:3001/api/register", {
      login: login, 
      password: password
    }).then((response) => {
      console.log(response);
    });
  };



  // logowanie
  const loginFunction = () => {

    Axios.post("http://localhost:3001/api/login", {
      login: login, 
      password: password
    }).then((response) => {

      if (response.data.message) {
        setLoginStatus(response.data.message);
      }
      else {
        setLoginStatus(response.data[0].login);
      }
    });
  };



  // pozostajemy zalogowani po odświeżeniu strony
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {

      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].login);
      } 
    });
  }, []);



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
          <h1 class="list__heading"><span>Dostępne filmy</span></h1>

          {movieReviewList.map((val) => {
            return (
              <div className="card">
                <h2> {val.movieName} </h2>
                <p> {val.movieReview} </p>


              </div>
            )
          })}

        </div> 

        <div class="list__container-2">
          <h1 class="list__heading"><span>Znajdź film</span></h1>
          <input class="input" placeholder="czego szukasz?" type="text" spellcheck="false"/>
          <button id="findButton" class="main__btn"><a href="#">Szukaj</a></button>
        </div>

      </div>



      <div class="borrow" id="borrow">
        <div class="borrow__container">
          <h1>Wypożycz film</h1>
          <button id="borrowButton" class="main__btn"><a href="#borrow">Wypożycz</a></button>
        </div>
      </div>



      <div class="manage" id="manage">
        <div class="manage__container">
          <h1>Zarządzaj filmami</h1>
          <div>
            <h2 class="list__heading"><span>Nazwa</span></h2>
            <input class="input" spellcheck="false" placeholder="nazwa filmu" name="movieName" onChange={(e)=> {setMovieName(e.target.value)}} />
            <h2 class="list__heading"><span>Recenzja</span></h2>
            <input class="input" spellcheck="false" placeholder="recenzja" name="review" onChange={(e)=> {setReview(e.target.value)}} />
            <div>
              <button id="addButton" class="main__btn" onClick={submitReview}><a href="#manage">Dodaj</a></button>
              <button id="deleteButton" class="main__btn" onClick={deleteMovie}><a href="#manage">Usuń</a></button>
              <button id="editButton" class="main__btn" onClick={editReview}><a href="#manage">Edytuj</a></button>
            </div>
          </div>
          <h3>{manageStatus}</h3>
        </div>
      </div>



      <div class="login" id="login">
        <div class="login__container">
          <h1>Zaloguj się lub załóż konto</h1>
          <input class="input" placeholder="login" type="text" spellcheck="false" name="login" onChange={(e)=> {setLogin(e.target.value)}}/>
          <input class="input" placeholder="hasło" type="text" spellcheck="false" name="password" onChange={(e)=> {setPassword(e.target.value)}}/>
          <div>
            <button id="loginButton" class="main__btn" onClick={loginFunction}><a href="#login">Zaloguj się</a></button>
            <button id="registerButton" class="main__btn" onClick={registerFunction}><a href="#login">Załóż konto</a></button>
          </div>
          <h2>{loginStatus}</h2>
        </div>
      </div>
    </div>
  )
}

export default App;