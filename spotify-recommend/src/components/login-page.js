import React, { Component } from 'react';
import AppContainer from './app-container';
import Collapse from 'react-collapse';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAboutClicked: false
    }
  }

  async onAboutClicked() {
   await this.setState({
      isAboutClicked: !this.state.isAboutClicked
    })
    let doc;
    doc = this.state.isAboutClicked ? document.getElementById('privacy') : document.getElementById('top');
    doc.scrollIntoView({behavior: "smooth"});
  }

  render() {
    const aboutClassName = this.state.isAboutClicked ? 'App-link expandable clickable expanded'
      : 
      'App-link expandable clickable';
    console.log(this.state.isAboutClicked);
    return (
      <AppContainer
          header = "Song Recommendations"
          content = {
            <div id = 'top' className = "opening-screen">
              <a className="App-link login expandable clickable"
                href = "http://localhost:8888/login">
                Login to Spotify to begin
              </a>
              <div className = {aboutClassName}
                    onClick = {this.onAboutClicked.bind(this)}>
                    About FindVibes
                    <div className = 'about-content'
                          style = {{display: this.state.isAboutClicked ? 'flex' : 'none'}}>
                      <p>We use your top songs and top artists from Spotify to create a personalized playlist for 
                         you in whichever time period you want.</p>
                      <p>Our site also offers 30 second music previews for your playlist and links
                       you to each song's album and each artist's top songs</p>
                      <p id = 'privacy'>We don't collect any data and permissions are used for the sake of creating the best 
                      and most relevant playlists for our users. </p>
                    </div>
              </div>
            </div>
          }
      />    
    );
  }
}

export default LoginPage;
