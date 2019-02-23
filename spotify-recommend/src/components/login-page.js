import React, { Component } from 'react';
import './login-page.css';
import AppContainer from './app-container';

class LoginPage extends Component {
  render() {
    return (
      <AppContainer
          header = "Song Recommendations"
          content = {
            <div className = "opening-screen">
              <a className="App-link login"
                href = "http://localhost:8888/login">
                Login to Spotify to begin
              </a>
              <a className="App-link">
                  About
              </a>
            </div>
          }
      />    
    );
  }
}

export default LoginPage;
