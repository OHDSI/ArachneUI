import * as URI from 'urijs';
import actions from 'modules/Vocabulary/actions';
import { cdmVersions, modal } from 'modules/Vocabulary/const';
import { Component } from 'react';
import { connect } from 'react-redux';
import { forms } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { paths } from 'modules/Vocabulary/const';
import { push as goToPage } from 'react-router-redux';
import { reduxForm, FormProps } from 'redux-form';
import presenter from './presenter';
import {
  IPanelStateProps,
  IPanelDispatchProps,
  IPanelProps,
} from './presenter';


class ControlPanel extends Component<IPanelProps & FormProps<{}, {}, {}>, void> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): IPanelStateProps {
  const selectedVocabularies = Object.keys(get(state, `form.${forms.download}.values.vocabulary`, {}));
  const cdmVersion = get(state, `form.${forms.downloadSettings}.values.cdmVersion`, '4.5');

  return {
    cdmVersion,
    selectedVocabularies,
    initialValues: {
      cdmVersion: cdmVersions[0].value,
      selection: 'all',
    }
  };
}

const mapDispatchToProps = {
  showConfirmation: () => ModalUtils.actions.toggle(modal.download, true),
};

function mergeProps(
    stateProps: IPanelStateProps,
    dispatchProps: IPanelDispatchProps,
  ): IPanelProps {
  return {
    ...stateProps,
    ...dispatchProps,
    download: () => dispatchProps.showConfirmation(),
  };
}

const FormControlPanel = reduxForm({
  form: forms.downloadSettings,
})(ControlPanel);

export default connect<IPanelStateProps, IPanelDispatchProps, void>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )(FormControlPanel);
