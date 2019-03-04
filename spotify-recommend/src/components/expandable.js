import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

Expandable.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    expandableChildClassName: PropTypes.string,
    header: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    display: PropTypes.string.isRequired,
    expandedContent: PropTypes.node.isRequired  
}

export default Expandable;