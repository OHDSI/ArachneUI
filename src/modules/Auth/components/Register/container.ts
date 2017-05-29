import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import professionalTypes from 'modules/Auth/actions/professionalTypes';
import presenter from './presenter';

interface IStateProps {
  isUserAuthed: boolean,
}

interface IDispatchProps {
  loadProfessionalTypes: Function,
  goToRoot: Function,
}

interface IRegisterProps extends IStateProps, IDispatchProps {}

class Register extends Component<IRegisterProps, {}> {
  componentWillMount() {
    if (this.props.isUserAuthed) {
      this.props.goToRoot();
    }
    this.props.loadProfessionalTypes();
  }
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state): IStateProps {
  return {
    isUserAuthed: !!state.auth.core.token,
  };
}

const mapDispatchToProps = {
  goToRoot: goToPage.bind(null, '/'),
  loadProfessionalTypes: professionalTypes.load,
};

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
 )
(Register);
