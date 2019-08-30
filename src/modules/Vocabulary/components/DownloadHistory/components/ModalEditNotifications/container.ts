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
import { reduxForm, change as reduxFormChange } from 'redux-form';
import { ModalUtils } from 'arachne-ui-components';
import { modal, forms } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import selectors from 'modules/Vocabulary/components/List/components/Results/selectors';
import presenter from './presenter';
import { IModalProps, IModalStateProps, IModalDispatchProps } from './presenter';

class ModalEditNotifications extends Component<IModalProps, {}> {
  componentWillReceiveProps(nextProps) {
    if(this.props.isOpened === false && nextProps.isOpened === true) {
      this.props.getNotifications();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: any): IModalStateProps {
  const isOpened = get(state, `modal.${modal.notifications}.isOpened`, false);
  const selectedVocabs = get(state, 'vocabulary.notifications.queryResult', []);
  const isLoading = get(state, 'vocabulary.notifications.isLoading', false);

	return {
    isOpened,
    selectedVocabs,
    isLoading,
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.notifications, false),
  removeNotification: actions.download.removeNotification,
  getNotifications: actions.download.getNotifications,
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
    removeVocabulary: (vocabularyCode: string) => {
      dispatchProps.removeNotification(vocabularyCode)
        .then(() => dispatchProps.getNotifications()
          .then(() => {
            if (stateProps.selectedVocabs.length === 1) { // was 1
              dispatchProps.close();
            }
          })
        );
    },
  };
}

let ReduxModalWindow = reduxForm({ form: forms.notifications })(ModalEditNotifications);
ReduxModalWindow = ModalUtils.connect({ name: modal.notifications })(ReduxModalWindow);

export default connect<IModalStateProps, IModalDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
