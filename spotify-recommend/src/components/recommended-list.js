import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import uuid from 'uuid';
import { ClimbingBoxLoader } from 'react-spinners';
import RecommendedListItem from './recommended-list-item';
import AppContainer from './app-container';
import SelectButton from './select-button';

const sortOptions = [
    {value: 'popularity', label: 'by popularity'},
    {value: 'name', label: 'by song name'},
    {value: 'artists[0].name', label: 'by artist name'},
    {value: 'random', label: 'randomly'}
];
const spotifyApi = new SpotifyWebApi();
const maxSeeds = 5;
class RecommendedList extends Component {
    /*
    * Constructs this recommendedList and creates a playlist from user's top tracks and artists
    * @param {string} access_token, access_token to use spotify web api
    * @param {string} refresh_token, refresh_token used when access_token expires
    */
    constructor(props) {
        super(props);
        this.state = {
            access_token: this.props.access_token,
            recommendedList: [],
            country: null,
            error: null,
            selectedSortOption: 'null',
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
        this.getUsersTopIds = this.getUsersTopIds.bind(this);
        this.getRecommendedTracksAndCreatePlaylist = this.getRecommendedTracksAndCreatePlaylist.bind(this);
        this.renderSortOption = this.renderSortOption.bind(this);
        this.sortList = this.sortList.bind(this);

        this.getRecommendedTracksAndCreatePlaylist();
    }

    /*
    * Gets the top ids for a given seed from user options, which can be either only artists, 
    * split between artists and tracks, and only tracks and at a user selected time range
    * @returns {Object}, an object with key-value pairing representing seedType and Spotify Ids of the
    * top user preferences in that seedType
    */
    async getUsersTopIds() {  
        let userTopIds;  
        let topArtists;
        let topTracks;
        
        if (this.props.options.recommendationsMethod === 'onlyArtist') {
            topArtists = await spotifyApi.getMyTopArtists({
                limit: this.props.options.useTopTracks, 
                time_range: this.props.options.timeRange
            });
            userTopIds = {seed_artists: await topArtists.items.map(artist => artist.id)};
        } 
        
        else if (this.props.options.recommendationsMethod === 'split') {
            const topTracksLen = Math.ceil(this.props.options.useTopTracks / 2);
            const topArtistsLen = this.props.options.useTopTracks - topTracksLen;

            topTracks = await spotifyApi.getMyTopTracks({
                limit: topTracksLen,
                time_range: this.props.options.timeRange
            });

            userTopIds = {seed_tracks: await topTracks.items.map(song => song.id)};
            if (topArtistsLen > 0) {
                topArtists = await spotifyApi.getMyTopArtists({
                    limit: topArtistsLen,
                    time_range: this.props.options.timeRange
                });
                userTopIds = {
                    ...userTopIds, 
                    ...{seed_artists: await topArtists.items.map(artist => artist.id)}};
            }
        } 
        
        else {
            topTracks = await spotifyApi.getMyTopTracks({
                limit: this.props.options.useTopTracks,
                time_range: this.props.options.timeRange
            });
            userTopIds = {seed_tracks: await topTracks.items.map(track => track.id)};
        } 

        return userTopIds;
    }

    /*
    * Uses user options to get their recommended tracks with properties in a given time range,
    * how large the playlist will be, how many seeds to use, and what kind of seeds and creates a 
    * Spotify playlist from recommended tracks
    */
    async getRecommendedTracksAndCreatePlaylist() {
        try {
            await spotifyApi.setAccessToken(this.props.access_token);

            let usersTopIds = await this.getUsersTopIds();
            let recommendedTracks = [];

            if (usersTopIds.seed_artists && usersTopIds.seed_artists.length > 0) {
                const recommendedTracksFromCall = await this.getRecommendedTracks(
                    usersTopIds.seed_artists, 'seed_artists');
                recommendedTracks = recommendedTracks.concat(recommendedTracksFromCall);
            }

            if (usersTopIds.seed_tracks && usersTopIds.seed_tracks.length > 0) {
                const recommendedTracksFromCall = await this.getRecommendedTracks(
                    usersTopIds.seed_tracks, 'seed_tracks');
                recommendedTracks = recommendedTracks.concat(recommendedTracksFromCall);
            }

            await this.createPlaylist(recommendedTracks);
        } catch (error) {
            console.log(error);
            await this.setState({
                error: error.status + ' while getting recommended songs'
            })
        }
    }

    /*
    * Returns the user's recommended Spotify tracks based on user's seedOption and using userTopIds as seeds 
    * @param {number[]} userTopIds, an array of Spotify Ids representing user's tops in the seedOption
    * @param {string} seedOption, a String refering to either "seed_tracks" or "seed_artists"
    * @returns {SpotifyTrackObject[]} recommended tracks for this user
    */
    async getRecommendedTracks(userTopIds, seedOption) {
        let numTracksToCreate = this.props.options.playListLength;
    
        if (this.props.options.recommendationsMethod === 'split') {
            if (seedOption === 'seed_tracks') {
                numTracksToCreate = Math.ceil(this.props.options.playListLength/2);
            } else if (seedOption === 'seed_artists') {
                numTracksToCreate = Math.floor(this.props.options.playListLength/2);
            }
        }
        
        if (userTopIds.length < maxSeeds) {
            const recommendedTracks = await spotifyApi.getRecommendations({
                limit: numTracksToCreate,
                [seedOption]: userTopIds
            })
            return recommendedTracks.tracks;
        }

        let seedsRemaining = userTopIds.length;
        let recommendedTracks = [];

        let numTracksRemaining = numTracksToCreate;
        for (let i = 0; seedsRemaining > 0 && numTracksRemaining > 0; i++) {
            let seedsToUse, numTracksPortion;
            
            if (seedsRemaining >= maxSeeds) {
                numTracksPortion = Math.round(numTracksToCreate / Math.floor(userTopIds.length / maxSeeds));
                seedsToUse = maxSeeds;
            } else {
                numTracksPortion = numTracksRemaining;
                seedsToUse = seedsRemaining;
            }

            const userTopIdsPortion = userTopIds.slice(i * seedsToUse, (i + 1) * seedsToUse - 1);
            const recommendedTracksPortion = await spotifyApi.getRecommendations({
                limit: numTracksPortion,
                [seedOption]: userTopIdsPortion 
            })
            recommendedTracks = recommendedTracks.concat(recommendedTracksPortion.tracks);
            seedsRemaining -= maxSeeds;
            numTracksRemaining -= numTracksPortion;
        }
        return recommendedTracks;
    }

    /*
    * Creates a Spotify playlist based on recommendedTracks and also with an artist's top tracks
    * @param {SpotifyTrackObject[]} recommendedTracks, an array of Spotify tracks objects 
    * representing a user's recommended tracks
    */
    async createPlaylist(recommendedTracks) {
        if (recommendedTracks.length > 0) {
            const recommendedListSongs = await recommendedTracks.map(song => 'spotify:track:' + song.id);
            const userId = await spotifyApi.getMe();

            const recommendedPlaylist = await spotifyApi.createPlaylist(userId.id, 
                {name: "Recommended Playlist " + uuid.v1(), 
                description: "made from spotify song recommender", public: false});
        
            await spotifyApi.addTracksToPlaylist
                (recommendedPlaylist.id, recommendedListSongs);       
            await this.setState({
                playListId: recommendedPlaylist.id,
                country: userId.country,
            });

            let recommendedTracksWithArtistTop = await recommendedTracks.map
                ((track) => this.addTopTracks(track, this.state.country));
            // used to resolve promise array returned by mapping each track to a promise in async call
            recommendedTracksWithArtistTop = await Promise.all(recommendedTracksWithArtistTop);

            await this.setState({
                recommendedList: recommendedTracksWithArtistTop,
                isLoaded: true
            })

            console.log(this.state);
        } else {
            this.setState({
                error: ' Must have Spotify history to use this website'
            })
        }
    }

    /*
    * Adds song to playlist based on this
    * @param {songId}, a spotify id for a song 
    * @param {callback}, a callback function for the caller
    */
    async addToPlayList(songId, callback) {
        try {
            await spotifyApi.addTracksToPlaylist(this.state.playListId, 
                ['spotify:track:' + songId], {position: 0});
            callback();
        } catch (error) {
            console.log(error);
            await this.setState({
                error: error.status + ' while adding to playlist'
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
            await spotifyApi.removeTracksFromPlaylist(this.state.playListId, 
                ['spotify:track:' + songId]);
            callback();
        } catch (error) {
            console.log(error);
            await this.setState({
                error: error.status
            })
        }
    }

    /*
    * Creates playlist based on list of recommended songs in this.state
    * @param {Object}, a track object containing basic song details such as uri, name, and artists
    * @param {string}, a country code representing the user's country
    * @returns {promise}, a promise track object with artist's top tracks added
    */
    async addTopTracks(track, country) {
        try {
            const topTracks = await spotifyApi.getArtistTopTracks(track.artists[0].id, country);
            track['topTracks'] = topTracks;
            return track;
        } catch (error) {
            console.log(error);
            await this.setState({
                error: error.status + ' while rendering top tracks'
            })   
            return track;
        }
    }

    /*
    * Plays or pauses a given audio_url in this player
    * @param {audio_url}, a url to an audio recording
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

    /*
    * Renders a RecommendedListItem with prop.listItem set to listItem
    * @param {Object}, listItem a recommendedListItem consisting of a song, producing artist's top songs,
    * popularity, song url, album info, etc.
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
                error: 'error' + ' while sorting'
            })
       }     
   }

    render() {
        let errorMessage;
        if (this.state.error) {
            errorMessage = 
                <div>
                    <h2 className = 'error-header'>{'Something went wrong'}</h2>
                    <h2 className = 'error-body'>{'Error:' + this.state.error}</h2>
                </div>
        }
        
        if (this.state.isLoaded) {
            let listItems = this.state.recommendedList.map(this.renderItem);
            let sortContent;
            if (this.state.isSortedButtonClicked) {
                sortContent = sortOptions.map(this.renderSortOption);
            }
            return(
                <AppContainer 
                    header = 'Song Recommendations'
                    content = {
                        <div>
                            {errorMessage}
                            <audio 
                                className = "audio-player" 
                                id = {'audio-player'} 
                                onEnded = {this.onAudioClipStopped}
                                controls>
                                <source id = {'audio-player-source'} src = {this.state.preview_url}></source>
                            </audio>
                                <div className = 'top-recommended-options-container'>
                                    <a 
                                        href = {'https://open.spotify.com/playlist/' + this.state.playListId}
                                        target = '_blank'
                                        rel="noopener noreferrer">
                                        <SelectButton 
                                            text = 'Playlist Link'
                                            className = "App-link recommend-button expandable"
                                        />
                                    </a>
                                    <div 
                                        className = {'App-link recommend-button expandable'}
                                        onClick = {() => this.setState(
                                            {
                                                isSortedButtonClicked: !this.state.isSortedButtonClicked
                                            })}
                                    >
                                            Sort Items
                                            <div className = 'about-content'
                                                style = 
                                                    {{display: 
                                                        this.state.isSortedButtonClicked ? 'block' : 'none'}}>
                                                    {sortContent}
                                            </div>
                                    </div>     
                                </div>
                            <ol className = 'song-list'>
                                {listItems}
                            </ol>
                        </div>
                    }
                />                   
            )
        } else {
            let loadingMessage =  
                <h2 className = 'loading-label'>Making your recommended playlist</h2>;
            if (errorMessage) {
                loadingMessage = errorMessage
            }
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
                            {loadingMessage}
                        </div>
                    }
                />      
            )
        }
    }
}

export default RecommendedList;