import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import OptionsBox from './options-box.js';
import './login-page.css';
import SelectButton from './select-button.js';
import 'rc-slider/assets/index.css';
import AppContainer from './app-container.js';

const timeRangeArray = [
    {name: 'shortTerm', text: 'The last 4 weeks'}, 
    {name: 'mediumTerm', text: 'The last 6 months'},
    {name: 'longTerm', text: 'All of your spotify history'}
];
const recommendationsMethodArray = [
    {name: 'onlyTrack', text: 'Only your top songs'}, 
    {name: 'split', text: 'Your top songs and artsts'},
    {name: 'onlyArtist', text: 'Only your top artists'}
];class OptionsPage extends Component {
    constructor(props) {
        super(props);

        // timeRange is either 'shortTerm', 'mediumTerm', or 'longTerm'
        // playListLength is [1, 100]
        // recommendationsMethod is either 'onlyTrack', 'split', or 'onlyArtist'
        // useTopTracks is [1, 20]
        this.state = {
            timeRange: 'mediumTerm',
            playListLength: 50, 
            recommendationsMethod: 'split',
            useTopTracks: 10  
        }

        this.onPlayListLengthChange = this.onPlayListLengthChange.bind(this);
        this.onTopTrackLengthChange = this.onTopTrackLengthChange.bind(this);
        this.onTimeRangeButtonClick = this.onTimeRangeButtonClick.bind(this);
        this.onRecommendationsMethodButtonClick = this.onRecommendationsMethodButtonClick.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderSlider = this.renderSlider.bind(this);
    }

    onPlayListLengthChange(newValue) {
        this.setState ({
            playListLength: newValue,
        })
    }

    onTopTrackLengthChange(newValue) {
        this.setState({
            useTopTracks: newValue
        })
    }

    onTimeRangeButtonClick(id) {
        this.setState({
            timeRange: id
        })
    }

    onRecommendationsMethodButtonClick(id) {
        this.setState({
            recommendationsMethod: id
        })
    }

    renderButton(onClick, activeCondition, buttonId) {
        return <SelectButton
            className = {"App-link options-button expandable"}
            onClick = {onClick}
            activeClassName = {"App-link options-button expandable" + " selected"}
            text = {buttonId.text}
            active = {activeCondition === buttonId.name}
            id = { buttonId.name }
        />;
    }

    renderSlider(onChange, max, value) {
        return <div className = 'slider-container'>
                    <p className = 'slider-label'>{value + ' songs'}</p>
                    <Slider
                        className = 'slider'
                        min = {1}
                        step = {1}
                        onChange = {onChange}
                        max = {max}
                        value = {value}
                    />
                </div>;
    }

    render() {
        let timeRangeBox = timeRangeArray.map((timeRange) => {
            return this.renderButton(this.onTimeRangeButtonClick, this.state.timeRange, timeRange)
        });
        let recommendationsBox = recommendationsMethodArray.map((recommendation) => {
            return this.renderButton(this.onRecommendationsMethodButtonClick, 
                this.state.recommendationsMethod, 
                recommendation)
        })
        let playlistSlider = this.renderSlider(this.onPlayListLengthChange, 
            100, this.state.playListLength);
        let songNumberSlider = this.renderSlider(this.onTopTrackLengthChange, 20, this.state.useTopTracks);

        return(
            <AppContainer
                header = 'Song Recommendations Options'
                content = {<div>
                        <OptionsBox
                            header = {'Pick your time range for recommendations'}
                            content = {timeRangeBox}
                        />
                        <OptionsBox
                            header = {'Pick your recommendation playlist length'}
                            content = {playlistSlider}
                        />
                        <OptionsBox
                            header = {'Pick what to use for your recommendations'}
                            content = {recommendationsBox}
                        />
                        <OptionsBox
                            header = {'Pick how many top songs or artists to use'}
                            content = {songNumberSlider}
                        />
                        <div className = 'submit-button expandable'>
                            <p className = 'options-header'>Create your personalized playlist!</p>
                        </div>
                    </div>
                }
            />                 
        )
    }
}

export default OptionsPage;