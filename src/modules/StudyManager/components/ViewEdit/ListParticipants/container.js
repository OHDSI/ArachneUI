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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/StudyManager/const';
import SelectorsBuilder from './selectors';
import ListParticipants from './presenter';

const selectors = (new SelectorsBuilder()).build();

export default class ListParticipantsBuilder {
  getComponent() {
    return ListParticipants;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data');

    return {
      studyId: get(studyData, 'id'),
      participantList: selectors.getParticipantList(state),
      hasEditPermissions: selectors.hasEditPermissions(state),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      openAddParticipantModal: ModalUtils.actions.toggle.bind(null, modal.addParticipant, true),
      loadStudy: actions.studyManager.study.find,
      addParticipant: actions.studyManager.study.participants.create,
      updateParticipant: actions.studyManager.study.participants.update,
      removeParticipant: actions.studyManager.study.participants.delete,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      addParticipant({ userId, role }) {
        dispatchProps
          .addParticipant(
          {
            studyId: stateProps.studyId,
          },
          {
            userId,
            role,
          }
          )
          .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }));
      },
      changeRole(userId, role) {
        dispatchProps
            .updateParticipant(
            { studyId: stateProps.studyId, userId },
            { role }
          )
          .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }));
      },
      removeParticipant(userId, name) {
        Utils.confirmDelete({
          message: `Are you sure you want to remove ${name} from participants?`,
        })
          .then(() => {
            dispatchProps
              .removeParticipant({ studyId: stateProps.studyId, userId })
              .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }));
          });
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}
