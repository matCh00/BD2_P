import './App.css';

function App() {
  return ( 
    <div className="App">
      <h1>DB Application</h1>   

        <div className="form">
          <label> Movie name: </label>
          <input type="text" name="movieName"/> 

          <label> Review: </label>
          <input type="text" name="review"/> 

          <button> Submit </button>
        </div>
      
    </div>
  );
}

export default App;