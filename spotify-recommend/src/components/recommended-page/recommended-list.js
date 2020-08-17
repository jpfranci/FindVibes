import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RecommendationsService from './recommendations-service.js';
import RecommendedListItem from './recommended-list-item';
import RecommendedListContainer from './recommended-list-container';
import SelectButton from '../select-button';
import LoadingScreen from './loading-screen';
import * as Cookies from "js-cookie";

const sortOptions = [
    {value: 'popularity', label: 'by song popularity'},
    {value: 'name', label: 'by song name'},
    {value: 'artists[0].name', label: 'by artist name'},
    {value: 'random', label: 'randomly'}
];

const errorMessages = {
    0: "There are some issues with some ad-blockers interfering with our requests with Spotify servers." +
    " (Don't worry we don't have any ads). Please whitelist us and try again.",
    20: "You must have Spotify history to use this site",
    400: "Sorry, page not found.",
    401: "Please refresh the page because permissions for Spotify has expired",
    429: "Site is going through heavy traffic. Please try again later",
    500: "Internal Server Error, something went wrong on Spotify's end",
    502: "Bad Gateway, please try again later",
    503: "Spotify servers are going through some traffic. Please try again later."
};

/* 
* RecommendedListPage is the main page of the application after user options are entered. It creates a 
* loading screen while requests are made to Spotify's API to create the user's recommended playlist. The page 
* also includes the algorithm for such requests. If requests finish without error, a list view of 
* RecommendedListItems is rendered onto the page otherwise an error message is printed on the loading page.
*/
class RecommendedListPage extends Component {
    /*
    * Constructs this recommendedList and creates a playlist from user's top tracks and artists
    * @param {string} access_token, access_token to use spotify web api
    * @param {string} refresh_token, refresh_token used when access_token expires
    */
    constructor(props) {
        super(props);
        this.state = {
            access_token: Cookies.get('access_token'),
            recommendedList: [],
            error: null,
            audio_url: "",
            isPlaying: false,
            isLoaded: false,
            currentSort: null,
            isSortedButtonClicked: false,
            playListId: null
        };
        
        this.renderItem = this.renderItem.bind(this);
        this.onPlayClickedAudio = this.onPlayClickedAudio.bind(this);
        this.addToPlayList = this.addToPlayList.bind(this);
        this.removeFromPlayList = this.removeFromPlayList.bind(this);
        this.onAudioClipStopped = this.onAudioClipStopped.bind(this);
        this.onSortButtonClicked = this.onSortButtonClicked.bind(this);
        this.renderSortOption = this.renderSortOption.bind(this);
        this.sortList = this.sortList.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
        console.log(this.props);
        this.recommender = new RecommendationsService({
            options: this.props.location.state.options,
            access_token: this.state.access_token
        });

        this.getRecommendations();
    }

    async getRecommendations() {
        try {
            const recommendedTrackInfo = await this.recommender.getRecommendedTracksAndCreatePlaylist();
            this.setState({
                recommendedList: recommendedTrackInfo.recommendedList,
                playListId: recommendedTrackInfo.playListId,
                isLoaded: true
            });
        } catch(error) {
            console.log(error)
            await this.setState({
                error: errorMessages[error.status] + " while adding song to playlist"
            });
        }        
    }

    /*
    * Adds song to playlist based on this
    * @param {songId}, a spotify id for a song 
    * @param {callback}, a callback function for the caller
    */
    async addToPlayList(songId, callback) {
        try {
            await this.recommender.addToPlayList(songId);
            callback();
        } catch (error) {
            console.log(error);
            await this.setState({
                error: errorMessages[error.status]
            })       
        }
    }

    /*
    * Removes song from this spotify playlist
    * @param {songId}, a spotify id for a song 
    * @param {callback}, a callback function for the caller
    */
    async removeFromPlayList(songId, callback) {
        try {
            this.recommender.removeFromPlayList(songId);
            callback();
        } catch (error) {
            console.log(error);
            await this.setState({
                error: error.status
            })
        }
    }

    /*
    * Plays or pauses a given audio_url in this player
    * @param {string}, a url to an audio recording
    * @returns {RecommendedListItem}, returns a rendered RecommendedListItem
    */
    onPlayClickedAudio(audio_url) {
        if (document.getElementById('audio-player') && audio_url && audio_url !== "") {
            let audioPlayer = document.getElementById('audio-player');
            let audioSource = document.getElementById('audio-player-source');

            if (audio_url === this.state.audio_url) {
                if (this.state.isPlaying) {
                    audioPlayer.pause();
                    this.setState({
                        isPlaying: false
                    })
                } else {
                    audioPlayer.play();
                    this.setState({
                        isPlaying: true
                    })
                }        
            } else {
                audioSource.src = audio_url;
                audioPlayer.load();
                audioPlayer.volume = 0.3;
                audioPlayer.play();
                this.setState({
                    audio_url: audio_url,
                    isPlaying: true
                })
            }
        } 
    }

     /* Fires when this audio player stops and sets state to not playing if valid audio_url */
    onAudioClipStopped() {
        if (this.state.isPlaying) {
            this.setState({
                isPlaying: false
            })
        }
    }

    onSortButtonClicked() {
        this.setState({
            isSortedButtonClicked: !this.state.isSortedButtonClicked
        });
    }

     /*
    * Sorts this recommended list of tracks by a sort method property and sets state to the sorted list
    * @param {string}, a SpotifyTrackObject property to sort with or random
    */
   sortList(sortMethod) {
    try {
        let recommendedList = this.state.recommendedList;
        
        if (sortMethod === 'random') {
            recommendedList.sort((a, b) => {
                return 0.5 - Math.random()
            });
        } else if (sortMethod === 'popularity') {
            recommendedList.sort((a,b) => {
                return b.popularity - a.popularity
            });
        } else if (sortMethod === 'name') {
            recommendedList.sort((a,b) => {
                return a.name.localeCompare(b.name)
            })
        } else if (sortMethod === 'artists[0].name') {
            recommendedList.sort((a,b) => {
                return a.artists[0].name.localeCompare(b.artists[0].name)
            })
        }

        this.setState({
            recommendedList: recommendedList,
            currentSort: sortMethod
        })
        } catch (error) {
            console.log(error);
            this.setState({
                error: 'error while sorting your list'
            })
        }     
    }   

    /*
    * Renders a RecommendedListItem with prop.listItem set to listItem
    * @param {Object}, listItem a SpotifyTrackObject with the artist's top songs appended
    * @returns {RecommendedListItem}, returns a rendered RecommendedListItem
    */
   renderItem(listItem) {
    return <RecommendedListItem 
                listItem = {listItem} 
                key = {listItem.id}
                playClicked = {this.onPlayClickedAudio}
                currentPlaying = {this.state.audio_url}
                isCurrentlyPlaying = {this.state.isPlaying}
                addToPlayList = {this.addToPlayList}
                removeFromPlayList = {this.removeFromPlayList}
            />;
   }

    /*
    * Renders a button with a given label and sorts the list by a given property when clicked
    * @param {Object}, an object with the label for the sort option and 
    * the SpotifyTrackObject property to sort with or random
    * @returns {SelectButton}, returns a Select Button that sorts the list by sort 
    * option property when clicked
    */
   renderSortOption(sortOption) {
       return  <SelectButton 
                    key = {sortOption.label}
                    text = {sortOption.label}
                    className = "sort-button clickable expandable"
                    onClick = {this.sortList} 
                    activeClassName = "sort-button clickable expandable selected"
                    active = {this.state.currentSort === sortOption.value}
                    id = {sortOption.value}
                />;
   }

    render() {
        let errorMessage;
        if (this.state.error) {
            errorMessage = 
                <div>
                    <h2 className = 'error-header'>{'Something went wrong'}</h2>
                    <h2 className = 'error-body'>{this.state.error}</h2>
                </div>
        }
        
        if (this.state.isLoaded) {
            let listItems = this.state.recommendedList.map(this.renderItem);
            let sortButtons = sortOptions.map(this.renderSortOption);
            return (
                <RecommendedListContainer
                    errorMessage = {errorMessage}
                    onAudioClipStopped = {this.onAudioClipStopped}
                    audio_url = {this.state.audio_url}
                    playListId = {this.state.playListId}
                    onSortButtonClicked = {this.onSortButtonClicked}
                    isSortButtonClicked = {this.state.isSortedButtonClicked}
                    sortButtons = {sortButtons}
                    recommendedListItems = {listItems}
                />      
            );
        } 
        
        else {
            let loadingMessage =  
                <h2 className = 'loading-label'>Making your recommended playlist</h2>;
            if (errorMessage) {
                loadingMessage = errorMessage
            }
            return(
                <LoadingScreen
                    loadingMessage = {loadingMessage}
                />
            );
        }
    }
}

RecommendedListPage.propTypes = {
    options: PropTypes.shape({
        timeRange: PropTypes.string,
        playListLength: PropTypes.number,
        recommendationsMethod: PropTypes.string,
        useTopTracks: PropTypes.number
    })
}

export default RecommendedListPage;