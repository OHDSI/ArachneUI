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
 * Created: February 07, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ContainerBuilder } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import { modal, forms } from 'modules/DataCatalog/const';
import presenter from './presenter';
import selectors from './selectors';

class ModalInviteToStudy extends Component {

  static propTypes() {
    return {
      isOpened: PropTypes.bool,
      dataSourceId: PropTypes.number,
      loadStudies: PropTypes.func,
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.loadStudies({
        query: '',
        dataSourceId: props.dataSourceId,
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class ModalInviteDSToStudyBuilder extends ContainerBuilder {

  getComponent() {
    return ModalInviteToStudy;
  }

  mapStateToProps(state) {
    const dsInfo = selectors.getDsInfo(state);
    const studyOptions = selectors.getStudyList(state);

    return {
      ...dsInfo,
      studyOptions,
      isOpened: get(state, `modal.${modal.inviteDataSource}.isOpened`, false),
    };
  }

  getMapDispatchToProps() {
    return {
      inviteDataSource: actions.dataCatalog.dataSource.invite.create,
      loadStudies: ({ query, dataSourceId }) =>
        actions.dataCatalog.studyList.query({ query, dataSourceId }),
      openConfirmDatasource: data => ModalUtils.actions.toggle(
        modal.confirmDatasource,
        true,
        data
      ),
      closeModal: () => ModalUtils.actions.toggle(modal.inviteDataSource, false),
      resetForm: resetForm.bind(null, forms.inviteDataSource),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ studyId }) {
        const submitPromise = dispatchProps.inviteDataSource({
          studyId,
          dataSourceId: stateProps.dataSourceId,
        });

        const study = stateProps.studyOptions.find(({ value }) => value === studyId);

        submitPromise
          .then(() => dispatchProps.resetForm())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.openConfirmDatasource({
            datasourceName: stateProps.name,
            study,
          }))
          .catch(() => {});

        return submitPromise;
      },
      loadStudyOptions: ({ query }) => {
        if (!stateProps.dataSourceId || stateProps.dataSourceId === -1) {
          return [];
        }
        return dispatchProps.loadStudies({ query, dataSourceId: stateProps.dataSourceId });
      },
    };
  }

  getModalParams() {
    return {
      name: modal.inviteDataSource,
    };
  }

  getFormParams() {
    return {
      form: forms.inviteDataSource,
    };
  }

}

export default ModalInviteDSToStudyBuilder;
