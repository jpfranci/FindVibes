import React, { Component } from 'react';
import LoginPage from "./components/login-page";
import RecommendedListPage from "./components/recommended-page/recommended-list";
import OptionsPage from './components/options-page/options';
import './App.css';

class App extends Component {
  /*
  * Sets state based if this window url has access_token
  */
  constructor(props) {
    super(props);
    const windowParams = this.getHashParams();
    const access_token = windowParams.access_token;

    this.state = {
      isLoggedIn: access_token ? true : false,
      access_token: access_token ? access_token : null,
      options: null,
    };

    this.onOptionsChange = this.onOptionsChange.bind(this);
  }

   /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  onOptionsChange(options) {
    this.setState({
      options: options
    })
  }

  /*
  * Renders the user's recommended songs if successfully logged in else displays a login page
  */
  render() {
    let page;

    if(!this.state.isLoggedIn) {
        page = <LoginPage/>
    } else if (!this.state.options) {
        page = <OptionsPage onOptionsChange = {this.onOptionsChange}/>
    } else {
        page = 
          <RecommendedListPage
            access_token = {this.state.access_token}
            options =  {this.state.options}  
          />
    }
    
    return (
      <div>
        {page}
      </div>
    );
  }
}

export default App;
