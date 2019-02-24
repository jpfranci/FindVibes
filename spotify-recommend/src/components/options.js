import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import OptionsBox from './options-box.js';
import SelectButton from './select-button.js';
import AppContainer from './app-container.js';

const timeRangeArray = [
    {name: 'short_term', text: 'The last 4 weeks'}, 
    {name: 'medium_term', text: 'The last 6 months'},
    {name: 'long_term', text: 'All of your spotify history'}
];
const recommendationsMethodArray = [
    {name: 'onlyTrack', text: 'Only your top songs'}, 
    {name: 'split', text: 'Your top songs and artists'},
    {name: 'onlyArtist', text: 'Only your top artists'}
];

class OptionsPage extends Component {
    constructor(props) {
        super(props);

        // timeRange is either 'short_term', 'medium_term', or 'long_term'
        // playListLength is [20, 100]
        // recommendationsMethod is either 'onlyTrack', 'split', or 'onlyArtist'
        // useTopTracks is [1, 20]
        this.state = {
            timeRange: 'medium_term',
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
            key = {buttonId.name}
            className = {"App-link options-button expandable clickable"}
            onClick = {onClick}
            activeClassName = {"App-link options-button expandable clickable selected"}
            text = {buttonId.text}
            active = {activeCondition === buttonId.name}
            id = { buttonId.name }
        />;
    }

    renderSlider(onChange, min, max, value) {
        return <div className = 'slider-container'>
                    <p className = 'slider-label'>{value + ' songs'}</p>
                    <Slider
                        className = 'slider'
                        min = {min}
                        step = {1}
                        onChange = {onChange}
                        max = {max}
                        value = {value}
                    />
                </div>;
    }

    render() {
        const timeRangeBox = timeRangeArray.map((timeRange) => {
            return this.renderButton(this.onTimeRangeButtonClick, this.state.timeRange, timeRange)
        });
        const recommendationsBox = recommendationsMethodArray.map((recommendation) => {
            return this.renderButton(this.onRecommendationsMethodButtonClick, 
                this.state.recommendationsMethod, 
                recommendation)
        })
        const playlistSlider = this.renderSlider(this.onPlayListLengthChange, 20,
            100, this.state.playListLength);
        const songNumberSlider = this.renderSlider(this.onTopTrackLengthChange, 1, 20, this.state.useTopTracks);

        return(
            <AppContainer
                header = 'Song Recommendations Options'
                content = {
                    <div>
                        <OptionsBox
                            header = {'Pick your time range for recommendations'}
                            content = {timeRangeBox}
                        />
                        <OptionsBox
                            header = {'Pick your playlist length for your recommendations'}
                            content = {playlistSlider}
                        />
                        <OptionsBox
                            header = {'Pick what to use for your recommendations'}
                            content = {recommendationsBox}
                        />
                        <OptionsBox
                            header = {'Pick how many top songs or artists to use for your recommendations'}
                            content = {songNumberSlider}
                        />
                        <div className = 'submit-button expandable clickable'>
                            <p 
                                className = 'options-header'
                                onClick = {() => {this.props.onOptionsChange(this.state)}}
                            >
                                Create your personalized playlist!</p>
                        </div>
                    </div>
                }
            />                 
        )
    }
}

export default OptionsPage;