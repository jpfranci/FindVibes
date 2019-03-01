import React, { Component } from 'react';

class InvisiblePlayer extends Component {
    render() {
        return <audio 
                    style = {{display: 'none'}}
                    id = {this.props.audioId}
                    onEnded = {() => this.props.onEnded()}  
                    controls
                >
                    <source 
                        id = {this.props.sourceId} 
                        src = {this.props.audioSource}></source>
                </audio>
    }
}

export default InvisiblePlayer;