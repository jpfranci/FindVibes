import React, { Component } from 'react';
import AppContainer from './app-container';
import Expandable from './expandable';

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
    const aboutClassName = this.state.isAboutClicked ? 'App-link opening-page-header expandable clickable expanded'
      : 
      'App-link expandable clickable';
      
    return (
      <AppContainer
          header = "Song Recommendations"
          content = {
            <div id = 'top' className = "opening-screen">
              <a className="App-link login  expandable clickable"
                href = "http://localhost:3300/login">
                Login to Spotify to begin
              </a>
              <Expandable
                className = {aboutClassName}
                onClick = {this.onAboutClicked.bind(this)}
                header = {'About FindVibes'}
                expandableChildClassName = {'about-content'}
                isExpanded = {this.state.isAboutClicked}
                display = {'flex'}
                expandedContent = 
                {
                  <div>
                    <p>We use your top songs and top artists from Spotify to create a personalized playlist for 
                       you in whichever time period you want.
                    </p>
                    <p>We offer more flexibility than Spotify's
                        usual playlist recommendations and let you finetune how you get your recommendations.
                    </p>
                    <p>Our site also offers 30 second music previews for your new songs and links
                       you to each artist's top songs and each song's album.
                    </p>
                    <p id = 'privacy'>We don't collect any of your Spotify data and permissions are used 
                      for the sake of creating the best and most relevant playlists for our users. 
                    </p>
                  </div>
                }
              />
            </div>
          }
      />    
    );
  }
}

export default LoginPage;
