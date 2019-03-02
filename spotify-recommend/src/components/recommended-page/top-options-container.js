import React, { Component } from 'react';
import SelectButton from '../select-button';
import Expandable from '../expandable';

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
                <Expandable 
                    className = 'App-link recommend-button expandable'
                    onClick = {this.props.onSortButtonClicked}
                    expandableChildClassName = 'about-content centered'
                    header = 'Sort Songs'
                    display = 'flex'
                    isExpanded = {this.props.isSortButtonClicked}
                    expandedContent = {this.props.sortButtons}
                />    
            </div>
        );
    }
}

export default TopOptionsContainer;