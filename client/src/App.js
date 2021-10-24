import React from "react";
import useState from "react";
import Axios from "axios";
import "./App.css";

function App() {

  const [movieName, setMovieName] = React.useState("");
  const [review, setReview] = React.useState("");

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
        </div>
      
    </div>
  );
}

export default App;