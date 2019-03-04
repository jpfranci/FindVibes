import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppContainer from '../app-container';
import InvisiblePlayer from './invisible-player';
import TopOptionsContainer from './top-options-container';

class RecommendedListContainer extends Component {
    render() {
        return (
            <AppContainer 
                header = 'Song Recommendations'
                content = {
                    <div className = 'recommended-list-container'>
                        {this.props.errorMessage}
                        <InvisiblePlayer 
                            audioId = {'audio-player'}
                            onEnded = {() => this.props.onAudioClipStopped()}
                            sourceId = {'audio-player-source'}
                            audioSource = {this.props.audio_url}
                        />
                        <TopOptionsContainer 
                            playListId = {this.props.playListId}
                            onSortButtonClicked = {this.props.onSortButtonClicked}
                            isSortButtonClicked = {this.props.isSortButtonClicked}
                            sortButtons = {this.props.sortButtons}
                        />
                    <ol className = 'song-list'>
                        {this.props.recommendedListItems}
                    </ol>
                </div>
                }
            />           
        );
    }    
}

RecommendedListContainer.propTypes = {
    errorMessage: PropTypes.node,
    onAudioClipStopped: PropTypes.func.isRequired,
    audio_url: PropTypes.string.isRequired,
    playListId: PropTypes.string.isRequired,
    onSortButtonClicked: PropTypes.func.isRequired,
    isSortButtonClicked: PropTypes.bool.isRequired,
    sortButtons: PropTypes.node,
    recommendedListItems: PropTypes.node
}

export default RecommendedListContainer;