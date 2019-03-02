import React, { Component } from 'react';

class Expandable extends Component {
    render() {
        return (
            <div 
                className = {this.props.className}
                onClick = {() => this.props.onClick()}
            >
                {this.props.header}
                <div 
                    className = {this.props.expandableChildClassName}
                    style = {{display: this.props.isExpanded ? this.props.display : 'none'}}
                >
                    {this.props.expandedContent}
                </div>
            </div>
        );
    }
}

export default Expandable;