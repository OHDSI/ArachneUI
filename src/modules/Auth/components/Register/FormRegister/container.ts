import { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import { register as doRegister } from 'modules/Auth/actions/principal';
import { forms, paths } from 'modules/Auth/const';
import presenter from './presenter';
import selectors from './selectors';

interface IStateProps {
  isLoading: boolean,
  professionalTypes: Object[],
}

interface IDispatchProps {
  doRegister: Function,
  goToWelcome: Function,
}

interface IRegisterProps extends IStateProps, IDispatchProps {}

class FormRegister extends Component<IRegisterProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state): IStateProps {
  return {
    isLoading: get(state, 'auth.professionalTypes.isLoading', false),
    professionalTypes: selectors.getProfessionalTypes(state),
  };
}

const mapDispatchToProps = function(dispatch): IDispatchProps {
  return {
    doRegister: (data) => dispatch(doRegister(data)),
    goToWelcome: () => dispatch(goToPage(paths.welcome())),
  }
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      const submitPromise = dispatchProps.doRegister(data);

      return submitPromise
        .then(() => dispatchProps.goToWelcome())
        .catch(
          (res) => {
            const errorData = Object.assign(
              {},
              res.validatorErrors,
              {_error: res.errorMessage}
            );
            throw new SubmissionError(errorData);
          }
        );
    },
  };
}

const ReduxFormRegister = reduxForm({
  form: forms.register,
})(FormRegister);

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )
(ReduxFormRegister);
