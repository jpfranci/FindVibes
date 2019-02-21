import React, { Component } from 'react';
import LoginPage from "./login-page.js";
import RecommendedList from "./recommended-list.js";

class App extends Component {
  /*
  * Sets state based if this window url has access_token and refresh_token
  */
  constructor(props) {
    super(props);
    const windowParams = this.getHashParams();
    const access_token = windowParams.access_token;
    const refresh_token = windowParams.refresh_token;

    this.state = {
      isLoggedIn: access_token ? true : false,
      access_token: access_token ? access_token : null,
      refresh_token: refresh_token ? refresh_token : null
    };
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

  /*
  * Renders the user's recommended songs if successfully logged in else displays a login page
  */
  render() {
    let page = this.state.isLoggedIn ? 
    <RecommendedList access_token = {this.state.access_token}
                     refresh_token = {this.state.refresh_token}/>
    : <LoginPage/>;
    console.log(this.state);

    return (
      <div>
        {page}
      </div>
    );
  }
}

export default App;
