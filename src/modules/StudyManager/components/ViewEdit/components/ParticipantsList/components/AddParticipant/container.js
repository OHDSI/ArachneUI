/*
  *
  * Copyright 2017 Observational Health Data Sciences and Informatics
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  * Company: Odysseus Data Services, Inc.
  * Product Owner/Architecture: Gregory Klebanov
  * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
  * Created: Wednesday, February 7, 2018 3:26 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { form, modal, newParticipantRolesOptions } from 'modules/StudyManager/const';
import { ModalUtils } from 'arachne-ui-components';
import { reset as resetForm } from 'redux-form';
import presenter from './presenter';

export class AddParticipant extends Component {
  static get propTypes() {
    return {
      isOpened: PropTypes.bool,
      loadParticipantOptions: PropTypes.func,
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.loadParticipantOptions({
        query: '',
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}
 
export default class AddParticipantBuilder extends ContainerBuilder {
  getComponent() {
    return AddParticipant;
  }

  
  getFormParams() {
    return {
      form: form.addParticipant,
      enableReinitialize: false,
    };
  }
 
  mapStateToProps(state) {     
    const moduleData = get(state, 'studyManager');

    const participantSuggestions = get(moduleData, 'participantList.data.result') || [];
    const participantOptions = participantSuggestions.slice(0, 10).map(user => ({
      label: `${user.firstname} ${user.lastname}`,
      value: user.id,
    }));

    return {
      studyId: get(moduleData, 'study.data.result.id'),
      studyName: get(moduleData, 'study.data.result.title'),
      isOpened: get(state, 'modal.addParticipant.isOpened', false),
      participantOptions,
      initialValues: {
        role: newParticipantRolesOptions[1].value,
      },
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      addParticipant: actions.studyManager.study.participants.create,
      loadStudy: actions.studyManager.study.find,
      loadParticipants: ({ query, studyId }) =>
        actions.studyManager.participantList.find({ query, studyId }),
      openConfirmParticipant: (user, studyName) => ModalUtils.actions.toggle(
        modal.confirmParticipant,
        true,
        { user, studyName }
      ),
      closeModal: () => ModalUtils.actions.toggle(modal.addParticipant, false),
      closeParticipantsModal: () => ModalUtils.actions.toggle(modal.participantsList, false),
      resetForm: resetForm.bind(null, form.addParticipant),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      
      async doSubmit({ participantId, role }) {
        const submitPromise = await dispatchProps.addParticipant(
          {
            studyId: stateProps.studyId,
          },
          {
            userId: participantId,
            role,
          }
        );

        const participant = stateProps.participantOptions.filter(user =>
          user.value === participantId
        )[0];

        try {
          await dispatchProps.resetForm();
          await dispatchProps.closeModal();
          await dispatchProps.closeParticipantsModal();
          await dispatchProps.openConfirmParticipant(participant, stateProps.studyName);
          await dispatchProps.loadStudy(stateProps.studyId);
        } catch (er) {
          if (__DEV__) {
            console.error(er);
          }
        }

        // We have to return a submission promise back to redux-form
        // to allow it update the state
        return submitPromise;
      },
      loadParticipantOptions({ query }) {
        const studyId = stateProps.studyId;
        if (studyId === undefined) {
          return [];
        }
        return dispatchProps.loadParticipants({ query, studyId });
      },
    };
  }
}
 
