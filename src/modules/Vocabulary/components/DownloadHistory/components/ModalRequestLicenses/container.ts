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
 * Authors: Alexandr Saltykov
 * Created: July 4, 2018
 *
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import actions from 'modules/Vocabulary/actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import selectors from 'modules/Vocabulary/components/List/components/Results/selectors';
import presenter from './presenter';
import { IModalProps, IModalStateProps, IModalDispatchProps } from './presenter';
import * as URI from "urijs";

class ModalRequestLicenses extends Component<IModalProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const licenses = get(state, `modal.${modal.licenses}.data.licenses`, []);
  const message = get(state, `modal.${modal.licenses}.data.message`, 'download');

  return {
    licenses,
    message,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.licenses, false),
  goToLicenses: url => push(url),
};

function mergeProps(
  stateProps: IModalStateProps,
  dispatchProps: IModalDispatchProps,
  ownProps
  ): IModalProps {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    goToLicenses() {
      const url = new URI(paths.vocabsList());
      url.setSearch({
        request: stateProps.licenses,
      });

      dispatchProps.goToLicenses(url.href());
    },
  };
}

let ReduxModalWindow =  ModalUtils.connect({ name: modal.licenses })(ModalRequestLicenses);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)
(ReduxModalWindow);
