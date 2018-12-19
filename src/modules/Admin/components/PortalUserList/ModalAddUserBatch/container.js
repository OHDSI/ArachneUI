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
 * Created: May 28, 2018
 *
 */

import { Component, PropTypes } from 'react';
import { reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal, paths } from 'modules/Admin/const';
import { validators } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';
import authActions from 'modules/Auth/ducks/index';
import { buildFormData, ContainerBuilder } from 'services/Utils';
import { push as goToPage } from 'react-router-redux';

class ModalAddUserBatch extends Component {

  static propTypes() {
    return {
      isOpened: PropTypes.bool,
      loadUserOptions: PropTypes.func,
    };
  }

  constructor() {
    super();
  }

  componentWillMount() {
    this.props.loadProfessionalTypes();
    this.props.loadTenantList();
  }

  render() {
    return presenter({
      ...this.props
    });
  }
}

class ModalAddUserBatchBuilder extends ContainerBuilder {

  getComponent() {
    return ModalAddUserBatch;
  }

  mapStateToProps(state) {

    const countries = selectors.getCountries(state);
    const provinces = selectors.getProvinces(state);
    const formState = get(state, 'form.addUserBatch.values', {});

    return {
      isOpened: get(state, `modal.${modal.addUserBatch}.isOpened`, false),
      professionalTypesOptions: selectors.getProfessionalTypes(state),
      tenantOptions: get(state, 'adminSettings.tenantList.queryResult', []).map(t => ({ label: t.name, value: t.id })),
      countries,
      provinces,
      formState,
      countryId: formState.address && formState.address.country,
      initialValues: {
        users: [{}]
      },
    };
  }

  getMapDispatchToProps() {
    return {
      addUsers: actions.adminSettings.usersGroup.create,
      closeModal: () => ModalUtils.actions.toggle(modal.addUserBatch, false),
      resetForm: resetForm.bind(null, forms.addUserBatch),
      resetFilters: () => goToPage(paths.users()),
      loadProfessionalTypes: authActions.actions.professionalType.query,
      loadTenantList: actions.adminSettings.tenantList.query,
      searchCountries: actions.adminSettings.countries.query,
      searchProvinces: actions.adminSettings.provinces.query,
    }
  }


  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const usersData = {
          users: data.users.map(u => ({
            address: {
              country: {},
              province: {},
            },
            ...u,
          })),
          tenantIds: data.tenantIds,
          password: data.password,
          emailConfirmationRequired: data.emailConfirmationRequired || false,
        };
        
        const submitPromise = await dispatchProps.addUsers({}, usersData);
        dispatchProps.resetForm();
        dispatchProps.closeModal();
        dispatchProps.resetFilters();

        return submitPromise;
      },
      searchCountries: (data) => {
        const query = get(data, 'query', '') || '';
        const countryId = get(stateProps.formState, `${data.rowDataKey}.address.country.isoCode`);

        return dispatchProps.searchCountries({
          query,
          includeId: countryId,
        });
      },
      searchProvinces: (data) => {
        const query = get(data, 'query', '') || '';
        const countryId = get(stateProps.formState, `${data.rowDataKey}.address.country.isoCode`);
        const provinceId = get(stateProps.formState, `${data.rowDataKey}.address.province.isoCode`);

        return dispatchProps.searchProvinces({
          query,
          countryId,
          includeId: provinceId,
        })
      },
    };
  }

  getModalParams() {
    return {
      name: modal.addUserBatch,
    };
  }

  getFormParams() {
    return {
      form: forms.addUserBatch,
    }
  }
}

export default ModalAddUserBatchBuilder;