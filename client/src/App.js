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

      <h1> Wypożyczalnia filmów </h1>   

        <div className="form">
          <label> Movie name: </label>
          <input type="text" name="movieName" onChange={(e)=> {setMovieName(e.target.value)}} />

          <label> Review: </label>
          <input type="text" name="review" onChange={(e)=> {setReview(e.target.value)}} /> 

          <button onClick={submitReview}> Submit </button>

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

        </div>
    </div>
  )
}

export default App;