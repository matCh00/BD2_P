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

   // status filtrowania
   const [filterStatus, setFilterStatus] = React.useState("");

  // nazwa filmu w wypożyczeniach
  const [borrowMovieName, setBorrowMovieName] = React.useState("");

  // widoczność panelu wypożyczeń
  const [borrowVisibility, setBorrowVisibility] = React.useState(false);

  // widoczność panelu zarządzania
  const [manageVisibility, setManageVisibility] = React.useState(false);



  Axios.defaults.withCredentials = true;


  // wyśiwtlenie listy po odświeżeniu strony
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setMovieList(response.data);
    });
  }, []);



  // filtrowanie listy filmów
  const filterMovies = () => {
    
    Axios.put("http://localhost:3001/api/filter", {movieType: movieType})
  
    .then((response) => {

      setMovieList(response.data.list);
      setFilterStatus("znaleziono: " + response.data.counter);
    });
      
    // aktualizacja bez potrzeby odświeżania strony
    setMovieList([
      ...movieList, 
      {movieName: movieName, movieRating: movieRating, movieType: movieType, movieYear: movieYear},
    ]);
  };



  // dodanie filmu
  const submitMovie = () => {

    // dodawać filmy może tylko admin
    if (loginStatus == "admin") {

      if (movieName.length > 0 && movieRating.length > 0 && movieType.length > 0 && movieYear.length > 0) {

        if (movieRating >= 0 && movieRating <= 10) {

          if (movieYear >= 1900 && movieYear <= 2022) {

            Axios.post("http://localhost:3001/api/insert", {
            movieName: movieName, 
            movieRating: movieRating,
            movieType: movieType,
            movieYear: movieYear
          });

          setManageStatus("Dodano");

          // aktualizacja bez potrzeby odświeżania strony
          setMovieList([
            ...movieList, 
            {movieName: movieName, movieRating: movieRating, movieType: movieType, movieYear: movieYear},
          ]);
          }
          else {
            setManageStatus("Rok: 1900-2022");
          }
        }
        else {
          setManageStatus("Ocena: 0-10");
        }
      }
      else {
        setManageStatus("Uzupełnij pola");
      }
    }

    // jeżeli jest to użytkownik
    else if (loginStatus.length > 0) {

      setManageStatus("Brak uprawnień");
    }
    else {
      setManageStatus("Zaloguj się");
    } 
  };



  // usuwanie filmu 
  const deleteMovie = () => {

    // usuwać film może tylko admin
    if (loginStatus == "admin") {

      Axios.post("http://localhost:3001/api/delete", {movieName: movieName})
      
      .then((response) => {
      
        if (response.data.message) {
          setManageStatus(response.data.message);
        }
        else {
          setManageStatus(" ");
        }
      });
    }

    // jeżeli nie jest to admin
    else if (loginStatus.length > 0) {

      setManageStatus("Brak uprawnień");
    }
    else {
      setManageStatus("Zaloguj się");
    }
  }



  // aktualizacja oceny filmu
  const editMovie = () => {

    // aktualizować ocenę filmu może tylko admin
    if (loginStatus == "admin") {

      if (movieRating.length > 0 && movieName.length > 0) {

        if (movieRating >= 0 && movieRating <= 10) {

          Axios.put("http://localhost:3001/api/update", {
            movieName: movieName,
            movieRating: movieRating,
          }).then((response) => {
      
            if (response.data.message) {
              setManageStatus(response.data.message);
            }
            else {
              setManageStatus(" ");
            }
          });
  
          setManageStatus("Zaktualizowano");
        }
  
        else {
          setManageStatus("Ocena: 0-10");
        }
      }
      else {
        setManageStatus("Uzupełnij pola");
      }
    }

    // jeżeli jest to użytkownik
    else if (loginStatus.length > 0) {

      setManageStatus("Brak uprawnień");
    }

    else {
      setManageStatus("Zaloguj się");
    }
  };



  // rejestracja
  const registerFunction = () => {

    Axios.post("http://localhost:3001/api/register", {

      login: login, 
      password: password

    }).then((response) => {
      
      if (response.data.message) {
        setLoginStatus(response.data.message);
      }
      else {
        setLoginStatus(" ");
      }
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

        setBorrowVisibility(false)
        setManageVisibility(false)
      }
      else {
        setLoginStatus(response.data[0].login);

        // wyświetlane elementy w zależności od uprawnień
        if (response.data[0].login == "admin") {
          setBorrowVisibility(true)
          setManageVisibility(true)
        }
        else {
          setBorrowVisibility(true)
          setManageVisibility(false)
        }
      }
    });
  };



  // pozostajemy zalogowani po odświeżeniu strony
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {

      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].login);

        // wyświetlane elementy w zależności od uprawnień
        if (loginStatus == "admin") {
          setBorrowVisibility(true)
          setManageVisibility(true)
        }
        else {
          setBorrowVisibility(true)
          setManageVisibility(false)
        }
      } 
    });
  }, []);



  // wypożyczenie filmu
  const rentMovie = () => {

    if (movieName.length == 0) {
      setRentStatus("Wpisz nazwę");
    }

    else if (loginStatus.length == 0) {
      setRentStatus("Zaloguj się");
    }

    else if (dateBegin == null || dateEnd == null) {
      setRentStatus("Podaj datę")
    }

    // wypożyczać film mogą tylko zalogowani użytkownicy
    else if (loginStatus.length > 0) {

      Axios.post("http://localhost:3001/api/rent", {
        movieName: movieName,
        dateBegin: dateBegin,
        dateEnd: dateEnd,
        login: login
      }).then((response) => {

        if (response.data.message) {
          setRentStatus(response.data.message);
        }
        else {
          setRentStatus(" ");
        }
      });
    }
  };



  // odebranie wypożyczonego filmu
  const pickupMovie = () => {

    if (movieName.length == 0) {
      setManageStatus("Wpisz nazwę");
    }

    else if (loginStatus.length == 0) {
      setManageStatus("Zaloguj się");
    }

    else if (loginStatus != "admin" && loginStatus.length > 0) {
      setManageStatus("Brak uprawnień")
    }

    // odebrać film może tylko admin
    else if (loginStatus == "admin") {

      Axios.put("http://localhost:3001/api/pickup", {movieName: movieName}
      
      ).then((response) => {

        if (response.data.message) {
          setManageStatus(response.data.message);
        }
        else {
          setManageStatus(" ");
        }
      });
    }
  };



  // przycisk na kartach
  const cardButtonFunction = (val) => {

    setMovieName(val.movieName)

    // nie działa 
    const input = document.getElementsByName("cardBtn")
    input.value = val.movieName
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
              <a href="#list" class="navbar__links" id="list-page">Przeglądaj</a>
            </li>

            {
              borrowVisibility?
            <li class="navbar__item">
              <a href="#borrow" class="navbar__links" id="borrow-page">Wypożycz</a>
            </li>
            :null
            }

            {
              manageVisibility?
            <li class="navbar__item">
              <a href="#manage" class="navbar__links" id="manage-page">Zarządzaj</a>
            </li>
            :null
            }

            <li class="navbar__btn">
              <a href="#login" class="button" id="login-page">Logowanie</a>
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
                {
                borrowVisibility?  
                <button class="main__btn" name="cardBtn" onClick={() => cardButtonFunction(val)}><a href="#borrow">Wypożycz</a></button>
                :null
                }
              </div>
            )
          })}
        </div> 

        <div class="list__container-2">
          <h1 class="list__heading"><span>Znajdź film</span></h1>
          <input class="input" placeholder="czego szukasz?" type="text" spellcheck="false" list="filter" onChange={(e)=> {setMovieType(e.target.value)}}/>
          <datalist id="filter">
            <option value="action">action</option>
            <option value="comedy">comedy</option>
            <option value="drama">drama</option>
            <option value="fantasy">fantasy</option>
            <option value="horror">horror</option>
            <option value="mystery">mystery</option>
            <option value="romance">romance</option>
            <option value="thriller">thriller</option>
          </datalist>
          <button id="findButton" class="main__btn" onClick={filterMovies}><a href="#list">Szukaj</a></button>

          <h3>{filterStatus}</h3>
        </div>

      </div>



      {
      borrowVisibility?  
      <div class="borrow" id="borrow">
        <div class="borrow__container">
          <h1>Wypożycz film</h1>
          <h2>Nazwa filmu</h2>
          <input class="input" type="text" spellcheck="false" placeholder="nazwa filmu" name="movieName" value={movieName} onChange={(e)=> {setMovieName(e.target.value)}} />
          <h2>Data wypożyczenia</h2>
          <input class="input" type="date" spellcheck="false" name="dateBegin" onChange={(e)=> {setBeginDate(e.target.value)}} />
          <h2>Data oddania</h2>
          <input class="input" type="date" spellcheck="false" name="dateEnd" onChange={(e)=> {setEndDate(e.target.value)}} />
          <button id="borrowButton" class="main__btn" onClick={rentMovie}><a href="#borrow">Wypożycz</a></button>
          <h3>{rentStatus}</h3>
        </div>
      </div>
      :null
      }

      {
        manageVisibility?
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
              <button id="pickupButton" class="main__btn" onClick={pickupMovie}><a href="#manage">Odbierz film</a></button>
            </div>
          </div>
          <h3>{manageStatus}</h3>
        </div>
      </div>
      :null
      }



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