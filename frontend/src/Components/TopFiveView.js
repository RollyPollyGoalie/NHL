import React from 'react';
import TopFiveList from './TopFiveList';
import getData from '../Requests';

class TopFiveView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        getData(this.props.data).then(response => {
            this.setState({data: response});
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            getData(this.props.data).then(response => {
                this.setState({data: response});
            });
        }
    }

    render() {
        
        return (
            <div>
                <div>
                    <p>{this.props.data}</p>
                </div>
                <TopFiveList data={this.state.data}/>
            </div>
        );
    }
}

export default TopFiveView;