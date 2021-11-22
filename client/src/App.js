import React from "react";
import useState from "react";
import { useEffect } from "react";
import Axios from "axios";
import "./App.css";


function App() {

  // nazwa filmu
  const [movieName, setMovieName] = React.useState("");

  // recenzja filmu
  const [movieRating, setMovieRating] = React.useState(0);

  // typ filmu
  const [movieType, setMovieType] = React.useState("");

  // rok produkcji filmu
  const [movieYear, setMovieYear] = React.useState(0);

  // lista filmów wraz z recenzjami
  const [movieList, setMovieList] = React.useState([]);

  // login
  const [login, setLogin] = React.useState("");

  // hasło
  const [password, setPassword] = React.useState("");

  // status logowania
  const [loginStatus, setLoginStatus] = React.useState("");

  // status zarządzania filmami
  const [manageStatus, setManageStatus] = React.useState("");

  // data wypożyczenia
  const [dateBegin, setBeginDate] = React.useState(new Date(2000, 1, 1));

  // data oddania
  const [dateEnd, setEndDate] = React.useState(new Date(2000, 1, 1));

  // status wypożyczenia
  const [rentStatus, setRentStatus] = React.useState("");

  // nazwa filmu w wypożyczeniach
  const [borrowMovieName, setBorrowMovieName] = React.useState("");


  Axios.defaults.withCredentials = true;


  // wyśiwtlenie listy po odświeżeniu strony
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setMovieList(response.data);
    });
  }, []);



  // dodanie filmu z recenzją
  const submitMovie = () => {

    if (movieRating >= 0 && movieRating <= 10) {

      if (movieYear >= 1900 && movieYear <= 2022) {

        // dodawać filmy może tylko admin
        if (loginStatus == "admin") {

          Axios.post("http://localhost:3001/api/insert", {
            movieName: movieName, 
            movieRating: movieRating,
            movieType: movieType,
            movieYear: movieYear
          });

          setManageStatus("dodano");

          // aktualizacja bez potrzeby odświeżania strony
          setMovieList([
            ...movieList, 
            {movieName: movieName, movieRating: movieRating, movieType: movieType, movieYear: movieYear},
          ]);
        }

        // jeżeli nie jest to admin
        else if (loginStatus.length > 0) {

          setManageStatus("brak uprawnień");
        }
        else {
          setManageStatus("zaloguj się");
        }
      }
      else {
        setManageStatus("rok: 1900-2022");
      }
    }
    else {
      setManageStatus("ocena: 0-10");
    }
  };



  // usuwanie filmu 
  const deleteMovie = () => {

    // usuwać film może tylko admin
    if (loginStatus == "admin") {
      Axios.post("http://localhost:3001/api/delete", {movieName: movieName});
      setManageStatus("usunięto");
    }

    // jeżeli nie jest to admin
    else if (loginStatus.length > 0) {

      setManageStatus("brak uprawnień");
    }
    else {
      setManageStatus("zaloguj się");
    }
  }



  // aktualizacja oceny filmu
  const editMovie = () => {

    if (movieRating >= 0 && movieRating <= 10) {

      // aktualizować ocenę filmu może tylko admin
      if (loginStatus == "admin") {

        Axios.put("http://localhost:3001/api/update", {
          movieName: movieName,
          movieRating: movieRating,
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
    }
    else {
      setManageStatus("ocena: 0-10");
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



  // wypożyczenie filmu
  const rentMovie = () => {

    if (movieName.length == 0) {
      setRentStatus("wpisz nazwę");
    }

    else if (loginStatus.length == 0) {
      setRentStatus("zaloguj się");
    }

    // wypożyczać film mogą tylko zalogowani użytkownicy
    else if (loginStatus.length > 0) {

      Axios.post("http://localhost:3001/api/rent", {
        movieName: movieName,
        dateBegin: dateBegin,
        dateEnd: dateEnd,
        login: login
      });

      setRentStatus("wypożyczono");
    }
  };


  // TODO: po naciśnięciu przycisku wypożycz na karcie, input w sekcji wypożyczenia wypełnia się nazwą filmu z danej karty
  // TODO: do tabeli movies dodać rekord: czy wypożyczone, uwzględnić to w komendach sql

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

          {movieList.map((val) => {
            return (
              <div class="card">
                <h2> {val.movieName} </h2>
                <h3>Ocena: {val.rating} </h3>
                <h3>Typ: {val.type} </h3>
                <h3>Rok: {val.year} </h3>
                <button class="main__btn"><a href="#borrow">Wypożycz</a></button>
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
          <h2>Data wypożyczenia</h2>
          <input class="input" type="text" spellcheck="false" placeholder="nazwa filmu" name="movieName" value={borrowMovieName} onChange={(e)=> {setMovieName(e.target.value)}} />
          <h2>Data wypożyczenia</h2>
          <input class="input" type="date" spellcheck="false" name="dateBegin" onChange={(e)=> {setBeginDate(e.target.value)}} />
          <h2>Data oddania</h2>
          <input class="input" type="date" spellcheck="false" name="dateEnd" onChange={(e)=> {setEndDate(e.target.value)}} />
          <button id="borrowButton" class="main__btn" onClick={rentMovie}><a href="#borrow">Wypożycz</a></button>
          <h3>{rentStatus}</h3>
        </div>
      </div>



      <div class="manage" id="manage">
        <div class="manage__container">
          <h1>Zarządzaj filmami</h1>
          <div>
            <h2 class="list__heading"><span>Nazwa</span></h2>
            <input class="input" spellcheck="false" placeholder="nazwa filmu" name="movieName" onChange={(e)=> {setMovieName(e.target.value)}} />

            <h2 class="list__heading"><span>Ocena</span></h2>
            <input class="input" spellcheck="false" type="number" placeholder="ocena" min="0" max="10" name="movieRating" onChange={(e)=> {setMovieRating(e.target.value)}} />

            <h2 class="list__heading"><span>Typ</span></h2>
            <input class="input" spellcheck="false" placeholder="typ" name="movieType" onChange={(e)=> {setMovieType(e.target.value)}} />

            <h2 class="list__heading"><span>Rok produkcji</span></h2>
            <input class="input" spellcheck="false" type="number" placeholder="rok" min="1900" max="2022" name="movieYear" onChange={(e)=> {setMovieYear(e.target.value)}} />

            <div>
              <button id="addButton" class="main__btn" onClick={submitMovie}><a href="#manage">Dodaj film</a></button>
              <button id="deleteButton" class="main__btn" onClick={deleteMovie}><a href="#manage">Usuń film</a></button>
              <button id="editButton" class="main__btn" onClick={editMovie}><a href="#manage">Edytuj ocenę</a></button>
            </div>
          </div>
          <h3>{manageStatus}</h3>
        </div>
      </div>



      <div class="login" id="login">
        <div class="login__container">
          <h1>Zaloguj się lub załóż konto</h1>
          <input class="input" placeholder="login" type="text" spellcheck="false" name="login" onChange={(e)=> {setLogin(e.target.value)}}/>
          <input class="input" placeholder="hasło" type="password" spellcheck="false" name="password" onChange={(e)=> {setPassword(e.target.value)}}/>
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