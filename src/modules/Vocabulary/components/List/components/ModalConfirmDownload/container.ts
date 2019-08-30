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

import { Component } from 'react';
import { connect } from 'react-redux';
import actions from 'modules/Vocabulary/actions';
import { change as reduxFormChange, reduxForm, reset, SubmissionError } from 'redux-form';
import {ModalUtils} from 'arachne-ui-components';
import { cdmVersions, forms, modal } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import selectors from 'modules/Vocabulary/components/List/components/Results/selectors';
import presenter, { IModalDispatchProps, IModalProps, IModalStateProps } from './presenter';

class ModalConfirmDownload extends Component<IModalProps, {}> {
  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened !== nextProps.isOpened && nextProps.isOpened === true) {
      this.props.reset();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const formSelectedVocabularies = get(state, `form.${forms.download}.values.vocabulary`, []);
  const selectedVocabIds = [];
  formSelectedVocabularies.map((voc: any, id: number) => {
    if (voc === true) {
      selectedVocabIds.push(id);
    }
  });
  const vocabs = selectors.getVocabs(state);
  const selectedVocabs = vocabs.filter(voc => selectedVocabIds.includes(voc.id));
  const isOpened = get(state, `modal.${modal.download}.isOpened`, false);
  const isLoading = get(state, 'vocabulary.download.isSaving', false)
    || get(state, 'vocabulary.notifications.isSaving', false);

	return {
    selectedVocabs,
    selectedVocabIds,
    isOpened,
    initialValues: {
      cdmVersion: cdmVersions[cdmVersions.length - 1].value,
    },
    isLoading,
  };
}

const mapDispatchToProps = {
  requestDownload: actions.download.requestDownload,
  remove: (id: number) => reduxFormChange(forms.download, `vocabulary[${id}]`, false),
  close: () => ModalUtils.actions.toggle(modal.download, false),
  showResult: () => ModalUtils.actions.toggle(modal.downloadResult, true),
  reset: () => reset(forms.bundle),
  updateNotifications: actions.download.requestNotifications,
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
    removeVocabulary: (id: number) => {
      dispatchProps.remove(id);
      if (stateProps.selectedVocabs.length === 1) {
        dispatchProps.close();
      }
    },
    download: ({bundleName, cdmVersion, notify}) => {
      let downloadVocabsAction = dispatchProps.requestDownload({
        cdmVersion: cdmVersion,
        ids: stateProps.selectedVocabIds.join(','),
        name: bundleName,
      });

      if (notify) {
        const codes = stateProps.selectedVocabs.map(vocab => vocab.code);
        downloadVocabsAction = downloadVocabsAction.then(_ => dispatchProps.updateNotifications(codes)
        );
      }

      const promise = Promise.resolve(downloadVocabsAction)
          .then(() => dispatchProps.close())
          .then(() => dispatchProps.showResult())
          .then(() => dispatchProps.loadList())
          .catch(({message}) => {
            throw new SubmissionError({
              _error: message,
            });
          });

      return promise;
    },
  };
}

let ReduxModalWindow = reduxForm({ form: forms.bundle })(ModalConfirmDownload);
ReduxModalWindow = ModalUtils.connect({ name: modal.download })(ReduxModalWindow);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
