import React from "react";
import useState from "react";
import { useEffect } from "react";
import Axios from "axios";
import "./App.css";

function App() {

  const [movieName, setMovieName] = React.useState("");
  const [review, setReview] = React.useState("");
  const [movieReviewList, setMovieList] = React.useState([]);


  // formatowanie wyświetlania danych na frontendzie
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
    }).then(() => {
      alert('successful insert');
    });
  };

  return ( 
    <div className="App">
      <h1>DB Application</h1>   

        <div className="form">
          <label> Movie name: </label>
          <input 
            type="text" 
            name="movieName" 
            onChange={(e)=> {
              setMovieName(e.target.value)}}/>

          <label> Review: </label>
          <input 
            type="text" 
            name="review" 
            onChange={(e)=> {
              setReview(e.target.value)}}/> 

          <button onClick={submitReview}> Submit </button>

          {movieReviewList.map((val) => {
            return <h3>MovieName: {val.movieName} | MovieReview: {val.movieReview}</h3>
          })}
        </div>
      
    </div>
  );
}

export default App;