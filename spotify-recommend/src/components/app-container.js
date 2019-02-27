import React, { Component } from 'react';
import logo from './spotify-logo.png';

class AppContainer extends Component {
    render() {
        return (
            <div id = "App" className = "App">
                <img className = "logo" src={logo} alt = {'problem here'}></img>
                <header className="App-header list"> 
                    <h2>{this.props.header}</h2> 
                </header>
                {this.props.content}
            </div>
        )
    }
}

export default AppContainer;