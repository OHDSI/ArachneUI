import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { get } from 'lodash';
import login from 'modules/Auth/actions/login';
import { forms, paths } from 'modules/Auth/const';
import presenter from './presenter';

interface IRemindStateProps {
}

interface IRemindDispatchProps {
  goToLogin: Function;
}

interface IRemindProps extends IRemindStateProps, IRemindDispatchProps {
  doSubmit: Function;
};

class Remind extends Component<IRemindProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  goToLogin: () => push(paths.login({ successfulReset: true })),
};

function mergeProps(
  stateProps: IRemindStateProps,
  dispatchProps: IRemindDispatchProps,
  ownProps: {}
): IRemindProps {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ email }) {
      const promise = login.remindPassword(email);
      promise.payload.promise
        .then(() => dispatchProps.goToLogin())
        .catch(() => {});

      return promise;
    },
  };
}

const FormRemind = reduxForm({
  form: forms.remind,
})(Remind);

export default connect<IRemindStateProps, IRemindDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(FormRemind);
