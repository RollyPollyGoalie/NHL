import React from 'react';

class TopFiveEntry extends React.Component {
    render() {
        return (
            <div key={this.props.key}>
                <img className="picture" alt={this.props.entry.name}></img>
                <p>{this.props.entry.Player_Name}</p>
                <p>{this.props.entry.stat}</p>
                <div class='transform-bar'></div>
            </div>
        );
    }
}

export default TopFiveEntry;