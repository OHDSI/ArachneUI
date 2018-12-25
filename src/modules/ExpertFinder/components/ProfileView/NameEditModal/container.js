/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: January 27, 2017
 *
 */

import actions from 'actions';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { reduxForm } from 'redux-form';
import { modal, forms } from 'modules/ExpertFinder/const';
import { get } from 'services/Utils';
import NameEditModal from './presenter';

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const firstname = get(moduleState, 'data.result.general.firstname', '');
  const lastname = get(moduleState, 'data.result.general.lastname', '');
  const middlename = get(moduleState, 'data.result.general.middlename', '');
  const id = get(moduleState, 'data.result.id', -1);

  return {
    initialValues: {
      firstname,
      lastname,
      middlename,
    },
    id,
  };
}

const mapDispatchToProps = {
  hideDialog: () => ModalUtils.actions.toggle(modal.nameEdit, false),
  updateGeneralInfo: actions.expertFinder.userProfile.generalInfo.update,
  loadMyProfile: actions.auth.principal.find,
  loadInfo: actions.expertFinder.userProfile.find,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    edit: ({ firstname, middlename, lastname }) => {
      const submitPromise = dispatchProps.updateGeneralInfo(
        null,
        { firstname, middlename, lastname }
      );
      submitPromise.then(() => dispatchProps.hideDialog())
        .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
        .then(() => dispatchProps.loadMyProfile())
        .catch(() => {});

      return submitPromise;
    },
  };
}

let ReduxModalWindow = reduxForm({ form: forms.nameEdit })(NameEditModal);
ReduxModalWindow = ModalUtils.connect({ name: modal.nameEdit })(ReduxModalWindow);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalWindow);
