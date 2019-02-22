import React, { Component } from 'react';
import './login-page.css';
import { Collapse } from 'react-collapse';
import { FaVolumeSlash } from 'react-icons/fa';
import { IoIosPlayCircle, IoIosArrowDown } from "react-icons/io";
import { MdPauseCircleFilled } from "react-icons/md";
import  SongInfo from './song-info.js';

class RecommendedListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTracks: this.props.listItem.topTracks,
            isOpened: false
        }
        this.handleListItemClicked = this.handleListItemClicked.bind(this);
        this.onPlayClicked = this.onPlayClicked.bind(this); 
        this.renderTopTrack = this.renderTopTrack.bind(this);
        this.getPlayOrPause = this.getPlayOrPause.bind(this);
    }

    handleListItemClicked() {
        this.setState (state => ({
            isOpened: !state.isOpened
        }));
    }

    onPlayClicked(previewUrl) {
        this.props.playClicked(previewUrl);
    }

    renderTopTrack(track) {
        const playOrPause = this.getPlayOrPause(track.preview_url);
        const listItem = this.props.listItem;   
        return(
            <SongInfo 
                key = {track.id}
                albumName = {track.album.name}
                albumUrl = {track.album.external_urls.spotify}
                artistName = {track.artists[0].name}
                albumCover = {track.album.images[2].url}
                previewUrl = {track.preview_url}
                songName = {track.name}
                id = {track.id}
                playInfo = {playOrPause}
                handlePlayClick = {this.onPlayClicked}
                handleArrowClick = {this.props.addToPlayList}
                removeFromPlayList = {this.props.removeFromPlayList}
                spotifyUrl = {listItem.external_urls.spotify}
                popularity = {listItem.popularity}
                isExpandable = {false}
            />
            )
    }

    getPlayOrPause(previewUrl) {
        const listItem = this.props.listItem;   
        const isPlaying = (previewUrl === this.props.currentPlaying && this.props.isCurrentlyPlaying);
        if (!listItem.preview_url) {
            return (<FaVolumeSlash 
                className = "list-item-child audio-preview" 
                id = {this.state.previewUrl}/>)
        } else {
            return isPlaying ? 
                <MdPauseCircleFilled
                    className = "list-item-child audio-preview" 
                    id = {this.state.previewUrl}
                />
                : 
                <IoIosPlayCircle 
                    className = "list-item-child audio-preview" 
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
            <li 
                key = {listItem.id} 
                className = 'list-item-li'>
                <SongInfo 
                    albumName = {listItem.album.name}
                    albumUrl = {listItem.album.external_urls.spotify}
                    artistName = {listItem.artists[0].name}
                    albumCover = {listItem.album.images[2].url}
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
        );
    }
}

export default RecommendedListItem; 