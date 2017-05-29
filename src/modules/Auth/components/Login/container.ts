import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as get from 'lodash/get';
import presenter from './presenter';

interface ILoginStateProps {
  backUrl: string;
}

interface ILoginDispatchProps {
  goToSSO: Function;
}

interface ILoginOwnProps {
  forceSSO: boolean;
}

interface ILoginProps extends ILoginStateProps, ILoginDispatchProps {};

class Login extends Component<ILoginProps, {}> {
  componentWillMount() {
    if (this.props.forceSSO) {
      this.props.goToSSO();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: Object): ILoginStateProps {
	return <ILoginStateProps> {
		backUrl: get(state, 'auth.core.backUrl', '/'),
    forceSSO: get(ownProps, 'location.query.forceSSO', false),
	};
}

const mapDispatchToProps = function(dispatch) {
	return {
		goToSSO: function(backUrl) {
			window.open('/auth/sso', 'SSO login', "width=600,height=700,scrollbars=no");
			(<any>window).onAuthDone = () => { window.location.href = backUrl }
		}
	}
};

function mergeProps(
    stateProps: ILoginStateProps,
    dispatchProps: ILoginDispatchProps,
    ownProps: ILoginOwnProps
  ): ILoginProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToSSO: () => {
      dispatchProps.goToSSO(stateProps.backUrl);
    },
  };
}

export default connect<ILoginStateProps, ILoginDispatchProps, ILoginOwnProps>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Login);
