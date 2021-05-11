import React from 'react';
import Menu from './Menu';

class NavBar extends React.Component {
    render() {
        return (
            <div className="navBar">
                <div className="title">
                    <h1>NHL STATS</h1>
                </div>
                <Menu />
            </div>
        );
    }
};

export default NavBar;