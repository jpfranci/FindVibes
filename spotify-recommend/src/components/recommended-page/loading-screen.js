import { ClimbingBoxLoader } from 'react-spinners';
import React, { Component } from 'react';
import AppContainer from '../app-container.js';

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

export default LoadingScreen;