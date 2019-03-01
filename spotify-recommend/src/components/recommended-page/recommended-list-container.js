import React, { Component } from 'react';
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
        )
    }    
}

export default RecommendedListContainer;