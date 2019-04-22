import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './spotify-logo.png';

class AppContainer extends Component {
    constructor(props) {
        
    }
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

AppContainer.propTypes = {
    header: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired
}


export default AppContainer;