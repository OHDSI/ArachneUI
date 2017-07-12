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

interface ILoginProps extends ILoginStateProps, ILoginDispatchProps, ILoginOwnProps {};

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

function handleLoginResult(backUrl, message) {
  if (message.data.type === 'loginResult') {
    // protection from webpack's post message    
    window.location.href = backUrl;
  }
}

const mapDispatchToProps = function(dispatch) {
	return {
    goToSSO: function(backUrl) {
      window.addEventListener('message', handleLoginResult.bind(null, backUrl));
  		window.open('/auth/sso', 'SSO login', "width=600,height=450,scrollbars=no");
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
