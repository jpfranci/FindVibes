import React, { Component } from 'react';
import './login-page.css';
import { FaSpotify, FaPlus, FaCheck } from 'react-icons/fa';
import { IoIosPlayCircle, IoIosArrowDown } from "react-icons/io";
import { MdClose, MdPauseCircleFilled } from "react-icons/md";

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
        window.open(url, '_blank');
    }

    addedToPlaylist() {
        this.setState({
            isAddedToPlayList: true
        })
    }

    render() {
        let addIconOrExpandable;
        if (this.props.isExpandable) {
            addIconOrExpandable = 
                <IoIosArrowDown 
                    onClick = {this.props.handleArrowClick}
                    className = 'list-item-child expand-button'
                />
        } else if (this.state.isAddedToPlayList) {
            addIconOrExpandable = <FaCheck className = 'list-item-child expand-button'/>
        } else {
            addIconOrExpandable = <FaPlus
                onClick = {() => {this.props.handleArrowClick(this.props.id, this.addedToPlaylist)}}
                className = 'list-item-child expand-button'
            />;
        }

        return (
            <div className = "list-item">
                <img 
                    src = {this.props.albumCover} 
                    onClick = {() => {this.handleUrlClick(this.props.albumUrl)}}
                    className = "list-item-child album-cover"
                    alt = "album cover"/>
                <h2 
                    className = "list-item-child song-details"
                    onClick = {this.props.handleArrowClick}>
                    {this.props.artistName + " - " + this.props.songName} 
                </h2>     
                <FaSpotify 
                    onClick = {() => {this.handleUrlClick(this.props.spotifyUrl)}}
                    className = "list-item-child url-logo" 
                    alt = "spotify link"/>
                <div onClick = {() => {this.props.handlePlayClick(this.props.previewUrl)}}>
                    {this.props.playInfo}
                </div>
                {addIconOrExpandable}  
        </div>
        )
    } 
}

export default SongInfo;