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
 * Created: September 29, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { reset as resetForm } from 'redux-form';
import { get } from 'services/Utils';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal, paths } from 'modules/Admin/const';
import { validators } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';
import authActions from 'modules/Auth/ducks/index';
import { buildFormData, ContainerBuilder } from 'services/Utils';
import { push as goToPage } from 'react-router-redux';

class ModalAddUser extends Component {

  static propTypes() {
    return {
      isOpened: PropTypes.bool,
      loadUserOptions: PropTypes.func,
    };
  }

  constructor() {
    super();
    this.state = {
      selectedCountry: null,
      selectedProvince: null,
    }
  }

  componentWillMount() {
    this.props.loadProfessionalTypes();
  }

  storeCountry(id) {
    this.setState({
      selectedCountry: this.props.countries.find(option => option.value === id),
    });
  }

  storeProvince(id) {
    this.setState({
      selectedProvince: this.props.provinces.find(option => option.value === id),
    });
  }

  render() {
    const countries = [...this.props.countries];
    const provinces = [...this.props.provinces];
    if (this.state.selectedCountry) {
      countries.unshift(this.state.selectedCountry);
    }
    if (this.state.selectedProvince) {
      provinces.unshift(this.state.selectedProvince);
    }

    return presenter({
      ...this.props,
      storeCountry: (id) => this.storeCountry(id),
      storeProvince: (id) => this.storeProvince(id),
      countries,
      provinces,
    });
  }
}

class ModalPortalUserListBuilder extends ContainerBuilder {

  getComponent() {
    return ModalAddUser;
  }

  mapStateToProps(state) {

    const countries = selectors.getCountries(state);
    const provinces = selectors.getProvinces(state);

    if (state.selectedCountry) {
      countries.unshift(state.selectedCountry);
    }
    if (state.selectedProvince) {
      provinces.unshift(state.selectedProvince);
    }

    const formState = get(state, 'form.addUser.values', {});

    return {
      isOpened: get(state, `modal.${modal.addUser}.isOpened`, false),
      userOptions: selectors.getUserOptionList(state),
      professionalTypesOptions: selectors.getProfessionalTypes(state),
      formState,
      countries,
      provinces,
      countryId: state.selectedCountry ? state.selectedCountry.value : null,
      provinceId: state.selectedProvince ? state.selectedProvince.value : null,
    };
  }

  getMapDispatchToProps() {
    return {
      addUser: actions.adminSettings.portalUserList.create,
      loadUserOptions: actions.adminSettings.userOptionList.query,
      closeModal: () => ModalUtils.actions.toggle(modal.addUser, false),
      resetForm: resetForm.bind(null, forms.addUser),
      resetFilters: () => goToPage(paths.users()),
      loadProfessionalTypes: authActions.actions.professionalType.query,
      searchCountries: actions.adminSettings.countries.query,
      searchProvinces: actions.adminSettings.provinces.query,
    }
  }


  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit(data) {
        const query = { type: stateProps.type };

        const reg = {
          ...data,
          address: {
            ...data.address,
            country: (data.address && data.address.country) ? { isoCode: data.address.country } : null,
            stateProvince: (data.address && data.address.stateProvince) ? { isoCode: data.address.stateProvince } : null,
          }
        };
        const submitPromise = dispatchProps.addUser({ id: null, query }, reg);

        submitPromise
          .then(dispatchProps.resetForm)
          .then(dispatchProps.closeModal)
          .then(dispatchProps.resetFilters)
          .catch(() => {
          });

        return submitPromise;
      },
      searchCountries: (data) => {
        const query = get(data, 'query', '') || '';

        return dispatchProps.searchCountries({
          query,
          includeId: !query ? stateProps.countryId : -1,
        });
      },
      searchProvinces: (data) => {
        const query = get(data, 'query', '') || '';

        return dispatchProps.searchProvinces({
          query,
          countryId: (stateProps.formState.address && stateProps.formState.address.country) || stateProps.countryId,
          includeId: !query ? stateProps.provinceId : - 1,
        })
      },
    };
  }

  getModalParams() {
    return {
      name: modal.addUser,
    };
  }

  getFormParams() {
    return {
      form: forms.addUser,
      validate: validators.checkPassword,
    }
  }
}

export default ModalPortalUserListBuilder;