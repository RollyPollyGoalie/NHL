import React from 'react';
import { Link } from "react-router-dom";




class MenuHeader extends React.Component {
    render() {
        const dropDown = this.props.dropDownItems.map((header, index) => (
            <li key={index} className="dropDownItem"><Link to={header.url}>{header.item}</Link></li>
        ));
        
        return (
            <li className="menuHeader">
                <h2>{this.props.title}</h2>
                <ul className="dropDown">
                    {dropDown}
                </ul>
            </li>
        )
    }
}

export default MenuHeader;