import React, { Component } from 'react';
import logo from './spotify-logo.png';

class AppContainer extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className = "App">
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