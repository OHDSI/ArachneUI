import { connect } from 'react-redux';
import { Component } from 'react';
import presenter from './presenter';
import { IFiltersPanelProps, IFiltersPanelDispatchProps, IFiltersPanelStateProps } from './presenter';

class TermFilterPanel extends Component<IFiltersPanelProps, {}> {
    render(){
        return presenter(this.props);
    }
}

function mapStateToProps(state: Object, ownProps: Object): IFiltersPanelProps {

    return {
    };
}

const mapDispatchToProps = {
};

export default connect<IFiltersPanelStateProps, IFiltersPanelDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(TermFilterPanel);


