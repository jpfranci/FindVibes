import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OptionsBox extends Component {
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

OptionsBox.propTypes = {
    header: PropTypes.string.isRequired,
    className: PropTypes.string,
    content: PropTypes.node.isRequired
}

export default OptionsBox;