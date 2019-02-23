import React, { Component } from 'react';

class SelectButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.active ? this.props.activeClassName : this.props.className;
        return (
            <p 
                className = {style}
                onClick = {() => {this.props.onClick(this.props.id)}}
            >
                {this.props.text}
            </p>
            )
    }
}

export default SelectButton;