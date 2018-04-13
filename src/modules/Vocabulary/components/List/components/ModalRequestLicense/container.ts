/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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

import { Component } from 'react';
import { connect } from 'react-redux';
import actions from 'modules/Vocabulary/actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Vocabulary/const';
import { licenseStatuses } from 'const/vocabulary';
import { get } from 'lodash';
import presenter from './presenter';
import {
  Vocabulary,
} from '../Results/selectors';

interface IModalStateProps {
  vocab: Vocabulary;
  isLoading: boolean;
};

interface IModalDispatchProps {
  close: () => null;
  requestLicense: (id: number) => Promise<any>;
  openConfirmModal: Function;
  loadList: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
  modal: string;
  request: Function;
};

class ModalRequestLicense extends Component<IModalProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const vocab: Vocabulary = get(state, 'modal.requestLicense.data', {
    id: -1,
    code: '',
    name: 'Unnamed vocabulary',
    available: true,
    update: '',
    index: 0,
    isCheckable: false,
    isChecked: false,
    tableRowClass: '',
    status: licenseStatuses.APPROVED,
    clickDefault: false,
  });
  const isLoading = get(state, 'vocabulary.vocabLicenses.isSaving', false);

	return {
    vocab,
    isLoading,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.requestLicense, false),
  requestLicense: actions.vocabularies.requestLicense,
  openConfirmModal: () => ModalUtils.actions.toggle(modal.confirmLicense, true),
  loadList: actions.vocabularies.load,
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
    request: () => {
      return dispatchProps.requestLicense(stateProps.vocab.id)
        .then(() => dispatchProps.close())
        .then(() => dispatchProps.openConfirmModal())
        .then(() => dispatchProps.loadList())
        .catch(() => {});
    },
  };
}

const ReduxModalWindow = ModalUtils.connect({ name: modal.requestLicense })(ModalRequestLicense);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
