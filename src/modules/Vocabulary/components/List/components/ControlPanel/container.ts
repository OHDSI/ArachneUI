/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import * as URI from 'urijs';
import actions from 'modules/Vocabulary/actions';
import { cdmVersions, modal } from 'modules/Vocabulary/const';
import { Component } from 'react';
import { connect } from 'react-redux';
import { forms } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-ui-components';
import { paths } from 'modules/Vocabulary/const';
import { push as goToPage } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import presenter from './presenter';
import {
  IPanelStateProps,
  IPanelDispatchProps,
  IPanelProps,
} from './presenter';


class ControlPanel extends Component<IPanelProps, void> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): IPanelStateProps {
  const vocs = get(state, `form.${forms.download}.values.vocabulary`, []);

  return {
    vocabulariesSelected: vocs.filter(v => v === true).length !== 0,
    initialValues: {
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
