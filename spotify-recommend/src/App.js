import React, { Component } from 'react';
import logo from './spotify-logo.png'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className = "App">
        <img className = "logo" src={logo}></img>
        <header className="App-header"> 
          <h2>Song Recommender</h2> 
        </header>
        <a className="App-link"
            href = "http://localhost:8888/login">
           Login to Spotify to begin
          </a>
          <a className="App-link">
            About
          </a>
        </div>
    );
  }
}

export default App;
