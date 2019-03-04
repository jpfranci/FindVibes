import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InvisiblePlayer extends Component {
    render() {
        return (
            <audio 
                style = {{display: 'none'}}
                id = {this.props.audioId}
                onEnded = {() => this.props.onEnded()}  
                controls
            >
                <source 
                    id = {this.props.sourceId} 
                    src = {this.props.audioSource}    
                />
            </audio>
        );
    }
}

InvisiblePlayer.propTypes = {
    audioId: PropTypes.string,
    onEnded: PropTypes.func.isRequired,
    sourceId: PropTypes.string,
    audioSource: PropTypes.string.isRequired
}

export default InvisiblePlayer;