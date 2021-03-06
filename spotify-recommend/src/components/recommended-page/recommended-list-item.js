import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import { FaVolumeSlash } from 'react-icons/fa';
import { IoIosPlayCircle } from "react-icons/io";
import { MdPauseCircleFilled } from "react-icons/md";
import  SongInfo from './song-info.js';

class RecommendedListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false
        }
        this.handleListItemClicked = this.handleListItemClicked.bind(this);
        this.onPlayClicked = this.onPlayClicked.bind(this); 
        this.renderTopTrack = this.renderTopTrack.bind(this);
        this.getPlayOrPause = this.getPlayOrPause.bind(this);
    }

    /*
    * Fires when the expand button or song text is clicked and sets this state to opened,
    * expanding its details
    */
    handleListItemClicked() {
        this.setState (state => ({
            isOpened: !state.isOpened
        }));
    }

    /*
    * Fires when play button is clicked and calls the playClicked props with the song preview url
    * @param {string}, previewUrl a url representing a link to a 30 second preview of a song
    */ 
    onPlayClicked(previewUrl) {
        this.props.playClicked(previewUrl);
    }

    /*
    * Renders an artist's top track and passes the appropriate icon if there is a preview url 
    * as a parameter
    * @param {SpotifyTrackObject}, track, a SpotifyTrackObject containing song info
    */ 
    renderTopTrack(track) {
        const playOrPause = this.getPlayOrPause(track.preview_url);
        const listItem = this.props.listItem;   
        return(
            listItem.name ? 
                <SongInfo 
                    key = {track.id}
                    albumName = {track.album.name}
                    albumUrl = {track.album.external_urls.spotify}
                    artistName = {track.artists[0].name}
                    albumCover = {track.album.images[2] ? track.album.images[2].url : null}
                    previewUrl = {track.preview_url}
                    songName = {track.name}
                    id = {track.id}
                    playInfo = {playOrPause}
                    handlePlayClick = {this.onPlayClicked}
                    handleArrowClick = {this.props.addToPlayList}
                    removeFromPlayList = {this.props.removeFromPlayList}
                    spotifyUrl = {track.external_urls.spotify}
                    popularity = {track.popularity}
                    isExpandable = {false}
                />
                :
                null
            )
    }

    getPlayOrPause(previewUrl) {
        // compares previewUrl to the currently playing track on the player 
        // and whether or not it is currently playing
        const isPlaying = (previewUrl === this.props.currentPlaying && this.props.isCurrentlyPlaying);
        if (!previewUrl) {
            return (<FaVolumeSlash 
                className = "audio-preview" 
                id = {this.state.previewUrl}/>)
        } else {
            return isPlaying ? 
                <MdPauseCircleFilled
                    className = "audio-preview expandable clickable" 
                    id = {this.state.previewUrl}
                />
                : 
                <IoIosPlayCircle 
                    className = "list-item-child audio-preview expandable clickable" 
                    id = {this.state.previewUrl}
                />     
        }
    }

    render() {
        const playOrPause = this.getPlayOrPause(this.props.listItem.preview_url);
        const listItem = this.props.listItem;
        const listItemTracks = listItem.topTracks.tracks;   
        let renderTopTracks = listItemTracks.map(this.renderTopTrack);
    
        return (
            listItem.name ? 
                <li 
                    className = 'list-item-li'>
                    <SongInfo 
                        albumName = {listItem.album.name}
                        albumUrl = {listItem.album.external_urls.spotify}
                        artistName = {listItem.artists[0].name}
                        albumCover = {listItem.album.images[2] ? listItem.album.images[2].url : null}
                        previewUrl = { listItem.preview_url}
                        songName = {listItem.name}
                        id = {listItem.id}
                        playInfo = {playOrPause}
                        handlePlayClick = {this.onPlayClicked}
                        handleArrowClick = {this.handleListItemClicked}
                        spotifyUrl = {listItem.external_urls.spotify}
                        popularity = {listItem.popularity}
                        isExpandable = {true}
                    />
                    <Collapse isOpened = {this.state.isOpened}> 
                        <div className = "collapsible">
                            <h2 className = "collapsible-header">{"Top Tracks by " + listItem.artists[0].name}</h2>
                            {renderTopTracks}
                        </div>
                    </Collapse>                
                </li>
                : 
                null
        );
    }
}

RecommendedListItem.propTypes = {
    playClicked: PropTypes.func,
    currentPlaying: PropTypes.string.isRequired, // the url currently playing
    isCurrentlyPlaying: PropTypes.bool.isRequired, // bool representing if the audio player is currently playinh
    addToPlayList: PropTypes.func.isRequired,
    removeFromPlayList: PropTypes.func.isRequired,
    listItem: PropTypes.shape({
        album: PropTypes.object.isRequired,
        artists: PropTypes.array.isRequired,
        preview_url: PropTypes.string,
        name: PropTypes.string.isRequired,
        external_urls: PropTypes.object.isRequired,
        popularity: PropTypes.number.isRequired,
        topTracks: PropTypes.shape({
            tracks: PropTypes.array.isRequired
        })
    }).isRequired
}

export default RecommendedListItem; 