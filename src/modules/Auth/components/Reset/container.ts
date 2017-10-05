import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { get } from 'lodash';
import login from 'modules/Auth/actions/login';
import { forms, paths, messages } from 'modules/Auth/const';
import presenter from './presenter';

interface IResetStateProps {
  isUserAuthed: boolean;
  email: String;
  token: string;
}

interface IResetDispatchProps {
  goToLogin: Function;
}

interface IResetProps extends IResetStateProps, IResetDispatchProps {
  doSubmit: Function;
};

class Reset extends Component<IResetProps, {}> {
  componentWillMount() {
    if (this.props.isUserAuthed) {
      this.props.goToLogin();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUserAuthed !== nextProps.isUserAuthed) {
      if (nextProps.isUserAuthed) {
        this.props.goToLogin();
      }
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const email = get(state, 'routing.locationBeforeTransitions.query.email', '');
  const token = get(state, 'routing.locationBeforeTransitions.query.token', '');

  return {
    isUserAuthed: !!get(state, 'auth.principal.data.id'),
    email,
    token,
  };
}

const mapDispatchToProps = {
  goToLogin: () => push(paths.login({ message: messages.RESET_SUCCESS })),
};

function mergeProps(
  stateProps: IResetStateProps,
  dispatchProps: IResetDispatchProps,
  ownProps: {}
): IResetProps {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ password }) {
      const promise = login.resetPassword({
        password,
        email: stateProps.email,
        token: stateProps.token,
      });
      promise.payload.promise
        .then(() => dispatchProps.goToLogin())
        .catch(() => {});

      return promise.payload.promise;
    },
  };
}

const FormReset = reduxForm({
  form: forms.reset,
})(Reset);

export default connect<IResetStateProps, IResetDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(FormReset);
