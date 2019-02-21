import React, { Component } from 'react';
import logo from './spotify-logo.png'
import './login-page.css';
import ReactList from 'react-list';
import SpotifyWebApi from 'spotify-web-api-js';

class RecommendedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: this.props.access_token,
            refresh_token: this.props.refresh_token,
            recommendedList: [],
            // Arrays of spotify id's of user's top artists and top tracks
            topArtists: [],
            topTracks: []
        };

        this.getRecommended();
    }

    async getRecommended() {
        try {
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(this.state.access_token);

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

        console.log(this.state.recommendedList);

        this.createPlaylist(spotifyApi);
        } catch (error) {
            if (error.status) {
                if (error.status == 401) {
                    // get renewed access token
                    window.location.href = 'http://localhost:8888/login'
                }
            } else 
            console.log(error);
        }
    }

    async createPlaylist(spotifyApi) {
        try {
            const recommendedListSongs = await this.state.recommendedList.map(song => 'spotify:track:' + song.id);
            const userId = await spotifyApi.getMe();
            const recommendedPlaylist = await spotifyApi.createPlaylist(userId.id, 
                {name: "Recommended Playlist", description: "made from my react app", public: false});
            const addToPlaylist = await spotifyApi.addTracksToPlaylist(recommendedPlaylist.id, recommendedListSongs);
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return (
        <div className = "App">
            <img className = "logo" src={logo}></img>
            <header className="App-header"> 
            <h2>Song Recommender</h2> 
            </header>
            <a className="App-link"
                href = "http://localhost:8888/login">
            Login to Spotify to begin
            </a>
            <a className="App-link">
                About
            </a>
            </div>
        );
    }
}

export default RecommendedList;
