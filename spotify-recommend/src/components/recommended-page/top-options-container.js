import React, { Component } from 'react';
import SelectButton from '../select-button';

class TopOptionsContainer extends Component {
    render() {
        return (
            <div className = 'top-recommended-options-container'>
                <a 
                    href = {'https://open.spotify.com/playlist/' + this.props.playListId}
                    target = '_blank'
                    rel="noopener noreferrer">
                    <SelectButton 
                        text = 'Playlist Link'
                        className = "App-link recommend-button expandable"
                    />
                </a>
                <div 
                    className = {'App-link recommend-button expandable'}
                    onClick = {() => this.props.onSortButtonClicked()}
                >
                    Sort Songs
                    <div 
                        className = 'about-content centered'
                        style = {{display: this.props.isSortButtonClicked ? 'flex' : 'none'}}
                    >
                        {this.props.sortButtons}
                    </div>
                </div>     
            </div>
        );
    }
}

export default TopOptionsContainer;