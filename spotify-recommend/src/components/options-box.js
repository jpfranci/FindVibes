import React, { Component } from 'react';

class OptionsBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div key = {this.props.header} 
                className = {this.props.className ? 
                    this.props.className : 'options-container'}>
                <p 
                    className = {this.props.className ? 
                        this.props.className : 'options-header'}
                >
                    {this.props.header}
                </p>
                <div className = 'time-range-container'>
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default OptionsBox;