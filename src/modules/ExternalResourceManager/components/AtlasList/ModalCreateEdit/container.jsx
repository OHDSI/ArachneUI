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
 * Authors: Pavel Grafkin
 * Created: March 15, 2018
 *
 */

import { Component, PropTypes } from 'react';
import { ContainerBuilder, get } from 'services/Utils';
import { reset as resetForm } from 'redux-form';
import { ModalUtils } from 'arachne-ui-components';
import { atlasAuthTypeList, modal, form } from 'modules/ExternalResourceManager/const';
import actions from 'actions';
import presenter from './presenter';

/** @augments { Component<any, any> } */
export class ModalCreateEdit extends Component {
  static get propTypes() {
    return {
      id: PropTypes.number,
      isOpened: PropTypes.bool,
      loadAtlasData: PropTypes.func,
      resetForm: PropTypes.func,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id && nextProps.id && nextProps.isOpened) {
      nextProps.loadAtlasData({ id: nextProps.id });
    } else if (this.props.isOpened && !nextProps.isOpened) {
      nextProps.clearAtlasData();
    }
  }

  render() {
    return presenter(this.props);
  }
}

class ModalCreateEditBuilder extends ContainerBuilder {

  getComponent() {
    return ModalCreateEdit;
  }

  mapStateToProps(state) {
    return {
      isOpened: get(state, 'modal.atlasDetails.isOpened'),
      id: get(state, 'modal.atlasDetails.data.id'),
      isLoading: get(state, 'externalResourceManager.atlases.list.isLoading'),
      initialValues: {
        authType: atlasAuthTypeList.none.value,
        ...get(state, 'externalResourceManager.atlases.list.data', {}, 'Object'),
      },
    };
  }

  getMapDispatchToProps() {
    return {
      loadAtlasData: actions.externalResourceManager.atlases.find,
      clearAtlasData: actions.externalResourceManager.atlases.clear,
      createAtlas: actions.externalResourceManager.atlases.create,
      updateAtlas: actions.externalResourceManager.atlases.update,
      resetForm: resetForm.bind(null, form.atlasDetails),
      closeModal: () => ModalUtils.actions.toggle(modal.atlasDetails, false),
      refreshList: actions.router.reload,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      resetForm() {
        dispatchProps.resetForm();
        dispatchProps.clearAtlasData();
      },
      async doSubmit(data) {
        let createOrUpdate;
        if (stateProps.id) {
          createOrUpdate = await dispatchProps.updateAtlas({ id: stateProps.id }, data);
        } else {
          createOrUpdate = await dispatchProps.createAtlas({}, data);
        }

        await dispatchProps.resetForm();
        await dispatchProps.closeModal();
        await dispatchProps.refreshList();

        return createOrUpdate;
      },
    };
  }

  getModalParams() {
    return {
      name: modal.atlasDetails,
    };
  }

  getFormParams() {
    return {
      form: form.atlasDetails,
      enableReinitialize: true,
    };
  }

}

export default ModalCreateEditBuilder;
