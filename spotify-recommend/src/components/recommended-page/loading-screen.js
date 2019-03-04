import { ClimbingBoxLoader } from 'react-spinners';
import React, { Component } from 'react';
import AppContainer from '../app-container.js';
import PropTypes from 'prop-types';

class LoadingScreen extends Component {
    render() {
        return(
            <AppContainer 
                header = "Song Recommendations"
                content = {
                    <div className = 'loading-container'>
                        <ClimbingBoxLoader 
                            color={'#4dcc62'}
                            sizeUnit = {'vh'}
                            size = {3}
                            loading = {true}
                        />
                        {this.props.loadingMessage}
                    </div>
                }
            />      
        );
    }
}

LoadingScreen.propTypes = {
    loadingMessage: PropTypes.element.isRequired
}

export default LoadingScreen;