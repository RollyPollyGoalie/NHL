import React from 'react';
import TopFiveEntry from './TopFiveEntry';

class TopFiveList extends React.Component {
    render() {
        const topFiveEntries = this.props.data.map((entryObject, index) => 
            <TopFiveEntry key={index} entry={entryObject} />
        );

        return (
            <div>
               {topFiveEntries}
            </div>
        );
    }
}

export default TopFiveList;