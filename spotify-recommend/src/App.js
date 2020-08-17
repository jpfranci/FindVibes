import React, { Component } from 'react';
import LoginPage from "./components/login-page";
import RecommendedListPage from "./components/recommended-page/recommended-list";
import OptionsPage from './components/options-page/options';
import './App.css';
import {Route, BrowserRouter, Switch} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
  }

  /*
  * Renders the user's recommended songs if successfully logged in else displays a login page
  */
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route path = '/options'>
              <OptionsPage onOptionsChange = {this.onOptionsChange}/>
            </Route>
            <Route path = '/recommendations' component={RecommendedListPage}>
            </Route>
            <Route path = "/">
              <LoginPage/>
            </Route>
          </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
