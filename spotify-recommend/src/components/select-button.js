import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectButton extends Component {
    render() {
        const style = this.props.active ? this.props.activeClassName : this.props.className;
        const onClick = this.props.onClick ? () => this.props.onClick(this.props.id) : null
        return (
            <p key = {this.props.id}
                className = {style}
                onClick = {onClick}
            >
                {this.props.text}
            </p>
        )
    }
}

SelectButton.propTypes = {
    active: PropTypes.bool,
    activeClassName: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string.isRequired
}

export default SelectButton;