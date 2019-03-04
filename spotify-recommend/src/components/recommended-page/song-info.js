import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaSpotify, FaPlus, FaCheck } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";

class SongInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddedToPlayList: false
        }
        this.handleUrlClick = this.handleUrlClick.bind(this);
        this.addedToPlaylist = this.addedToPlaylist.bind(this);
    }
    
    handleUrlClick(url) {
        const a = document.createElement("a");
        a.href = url;
        a.target = '_blank';
        a.rel = "noopener noreferrer";
        a.click();
        a.remove();
    }

    addedToPlaylist() {
        this.setState({
            isAddedToPlayList: !this.state.isAddedToPlayList
        })
    }

    render() {
        let addIconOrExpandable;
        if (this.props.isExpandable) {
            addIconOrExpandable = 
                <IoIosArrowDown 
                    onClick = {this.props.handleArrowClick}
                    className = 'expand-button clickable'
                />
        } else if (this.state.isAddedToPlayList) {
            addIconOrExpandable = <FaCheck 
                className = 'expand-button expandable clickable'
                onClick = {() => {this.props.removeFromPlayList(this.props.id, this.addedToPlaylist)}}
            />
        } else {
            addIconOrExpandable = <FaPlus
                onClick = {() => {this.props.handleArrowClick(this.props.id, this.addedToPlaylist)}}
                className = 'list-item-child expand-button expandable clickable'
            />;
        }

        return (
            <div className = "list-item">
                <img 
                    src = {this.props.albumCover} 
                    onClick = {() => {this.handleUrlClick(this.props.albumUrl)}}
                    className = "album-cover expandable clickable"
                    alt = "album cover"/>
                <h2 
                    className = "song-details clickable"
                    onClick = {this.props.handleArrowClick}>
                    {this.props.artistName + " - " + this.props.songName} 
                </h2>     
                <FaSpotify 
                    onClick = {() => {this.handleUrlClick(this.props.spotifyUrl)}}
                    className = "url-logo expandable clickable" 
                    alt = "spotify link"/>
                <div onClick = {() => {this.props.handlePlayClick(this.props.previewUrl)}}>
                    {this.props.playInfo}
                </div>
                {addIconOrExpandable}  
            </div>
        );
    } 
}

SongInfo.propTypes = {
    albumName: PropTypes.string.isRequired,
    albumUrl: PropTypes.string,
    artistName: PropTypes.string.isRequired,
    albumCover: PropTypes.string,
    previewUrl: PropTypes.string,
    songName: PropTypes.string.isRequired,
    playInfo: PropTypes.node.isRequired,
    handlePlayClick: PropTypes.func.isRequired,
    handleArrowClick: PropTypes.func.isRequired,
    removeFromPlayList: PropTypes.func,
    spotifyUrl: PropTypes.string.isRequired,
    popularity: PropTypes.number.isRequired,
    isExpandable: PropTypes.bool.isRequired
}

export default SongInfo;