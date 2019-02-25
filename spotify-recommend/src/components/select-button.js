import React, { Component } from 'react';

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

export default SelectButton;