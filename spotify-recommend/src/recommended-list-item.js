import React, { Component } from 'react';
import logo from './spotify-logo.png'
import './login-page.css';

class RecommendedListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItem: this.props.listItem
        }

        console.log('construto');
    }

    render() {
        return (
        <div className = "App">
            <p>{1}</p>
        </div>
        );
    }
}

export default RecommendedListItem; 