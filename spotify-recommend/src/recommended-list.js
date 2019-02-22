import React, { Component } from 'react';
import logo from './spotify-logo.png';
import SpotifyWebApi from 'spotify-web-api-js';
import uuid from 'uuid';
import { ClimbingBoxLoader } from 'react-spinners';
import RecommendedListItem from './recommended-list-item';

const spotifyApi = new SpotifyWebApi();
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
            refresh_token: this.props.refresh_token,
            recommendedList: [],
            country: null,
            error: null,
            audio_url:"https://p.scdn.co/mp3-preview/1472b9d5b92f0ba85e3d84347fad0c558843d98e?cid=932fead81902483fa625c45870b2c5ad",
            isLoaded: false
        };

        this.getRecommended();
    }

    /*
    * Gets recommended songs from user's top tracks and top artists in the past 6 months, and sets
    * this.state accordingly. Creates a playlist from recommended songs
    */
    async getRecommended() {
        try {
        spotifyApi.setAccessToken(this.state.access_token);

        // Spotify API has a limit of 5 seeds per recommendation request
        const topSongs = await spotifyApi.getMyTopTracks({limit: 5, offset: 0, time_range: 'medium_term'});
        let topSongsArray = await topSongs.items.map(song => song.id);

        const topArtists = await spotifyApi.getMyTopArtists({limit: 5, offset: 0, time_range: 'medium_term'});
        let topArtistsArray = await topArtists.items.map(artist => artist.id);
 
        let recommendedFromSongs = await spotifyApi.getRecommendations({limit: 30, 
          seed_artists: topArtistsArray});
        let recommendedFromArtists = await spotifyApi.getRecommendations({limit: 20, 
            seed_tracks: topSongsArray});
        
        recommendedFromSongs = recommendedFromSongs.tracks.concat(recommendedFromArtists.tracks);

        await this.setState({
            recommendedList: recommendedFromSongs
        });

        await this.createPlaylist();
        } catch (error) {
            if (error.status) {
                // error code 401 occurs when the access token has expired
                if (error.status === 401) {
                    // get renewed access token
                    window.location.href = 'http://localhost:8888/login'
                }
            } else 
                console.log(error);       
        }
    }

    /*
    * Creates playlist based on list of recommended songs in this.state
    * @param {SpotifyWebApi}, a SpotifyWebApi with access_code already in it
    */
    async createPlaylist() {
        try {
            const recommendedListSongs = await this.state.recommendedList.map(song => 'spotify:track:' + song.id);
            const userId = await spotifyApi.getMe();
            /*
            const recommendedPlaylist = await spotifyApi.createPlaylist(userId.id, 
                {name: "Recommended Playlist " + uuid.v1(), 
                description: "made from spotify song recommender", public: false});
            const addToPlaylist = await spotifyApi.addTracksToPlaylist
                (recommendedPlaylist.id, recommendedListSongs);
            */
            await this.setState({
                country: userId.country,
            });

            let addedTopTracks = await this.state.recommendedList.map
                ((track) => this.addTopTracks(track, this.state.country));
            // used to resolve promise array returned by mapping each track to a promise in async call
            addedTopTracks = await Promise.all(addedTopTracks);

            await this.setState({
                recommendedList: addedTopTracks,
                isLoaded: true
            })
            console.log(this.state);
        } catch(error) {
            console.log(error);     
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
            return track;
        }
    }

    onPlayClickedAudio(audio_url) {
        if (document.getElementById('audio-playera')) {
            let audioPlayer = document.getElementById('audio-playera');
            audioPlayer.audio = 0.5;
            audioPlayer.currentSrc = audio_url;
            audioPlayer.play();
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
                />;
}

    render() {
        if (this.state.isLoaded) {
            let listItems = this.state.recommendedList.map(this.renderItem);
            return(
                <div className = "App">
                    <img className = "logo" src={logo} alt = {'problem here'}></img>
                    <header className="App-header list"> 
                        <h2>Song Recommendations</h2> 
                    </header>
                    <audio src = {"https://p.scdn.co/mp3-preview/1472b9d5b92f0ba85e3d84347fad0c558843d98e?cid=932fead81902483fa625c45870b2c5ad"}
                           className = "audio-player" 
                           id = {'audio-playera'}      
                           controls/>
                    <ol>
                        {listItems}
                    </ol>
                </div>
            )
        } else {
            return(
                <div className = "App">
                    <img className = "logo" src={logo} alt = {'problem here'}></img>
                    <header className="App-header"> 
                        <h2>Song Recommender</h2> 
                    </header>
                    <ClimbingBoxLoader 
                        color={'#4dcc62'}
                        sizeUnit = {'vh'}
                        size = {3}
                        loading = {true}
                    />   
                    <h2 className = 'loading-label'>Making your recommended playlist</h2>
                    {this.state.error}
                </div>        
            )
        }
    }
}

export default RecommendedList;