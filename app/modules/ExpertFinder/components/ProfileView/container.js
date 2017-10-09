/**
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
 * Created: January 16, 2017
 *
 */

import { connect } from 'react-redux';
import { Component, PropTypes } from 'react';
import { ModalUtils } from 'arachne-components';
import get from 'lodash/get';
import { modal } from 'modules/ExpertFinder/const';
import actions from 'modules/ExpertFinder/actions/index';
import { asyncConnect } from 'redux-async-connect';
import { goBack } from 'react-router-redux';
import presenter from './presenter';


class ProfileView extends Component {

  componentWillReceiveProps(props) {
    if (this.props.id !== props.id) {
      this.props.loadInfo(props.id);
    }
  }

  render() {
    return presenter(this.props);
  }
}

ProfileView.propTypes = {
  loadInfo: PropTypes.func,
  id: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const moduleState = state.expertFinder.userProfile;
  const isLoading = get(moduleState, 'isLoading', false);
  const isCreatingSkill = get(state.expertFinder, 'skills.isLoading', false);
  let firstname = get(moduleState, 'data.general.firstname', '');
  const lastname = get(moduleState, 'data.general.lastname', '');
  const middlename = get(moduleState, 'data.general.middlename', '');
  const id = ownProps.routeParams.userId;
  const editable = get(moduleState, 'data.isEditable', false);
  if (!firstname && !middlename && !lastname) {
    firstname = 'an expert';
  }

  return {
    editable,
    name: [firstname, middlename, lastname].filter(val => !!val).join(' '),
    id,
    isLoading: isLoading || isCreatingSkill,
  };
}

const mapDispatchToProps = {
  loadInfo: actions.userProfile.loadInfo,
  showNameEditDialog: () => ModalUtils.actions.toggle(modal.nameEdit, true),
  showInviteDialog: user => ModalUtils.actions.toggle(modal.invite, true, { ...user }),
  goBack,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    invite: () => {
      dispatchProps.showInviteDialog({
        id: stateProps.id,
        general: {
          firstname: stateProps.firstname,
          lastname: stateProps.lastname,
          middlename: stateProps.middlename,
        },
      });
    },
  };
}

const connectedProfileView = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProfileView);

export default asyncConnect([{
  promise: ({ params, store: { dispatch } }) => {
    const loadInfo = actions.userProfile.loadInfo;
    return dispatch(loadInfo(params.userId));
  },
}])(connectedProfileView);
