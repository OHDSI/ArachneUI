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
import { reduxForm, Form } from 'redux-form';
import presenter from './presenter';
import {
  IPanelStateProps,
  IPanelDispatchProps,
  IPanelProps,
} from './presenter';


class ControlPanel extends Component<IPanelProps & Form<{}, {}, {}>, void> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): IPanelStateProps {
  const cdmVersion = get(state, `form.${forms.downloadSettings}.values.cdmVersion`, '');
  const selectedVocabularies = Object.keys(get(state, `form.${forms.download}.values.vocabulary`, {}));

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
  requestDownload: actions.download.requestDownload,
};

function mergeProps(
    stateProps: IPanelStateProps,
    dispatchProps: IPanelDispatchProps,
  ): IPanelProps {
  return {
    ...stateProps,
    ...dispatchProps,
    download: () => dispatchProps.requestDownload({
        cdm_version: stateProps.cdmVersion,
        ids: stateProps.selectedVocabularies,
      }).then(() => dispatchProps.showConfirmation()),
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
