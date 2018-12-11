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

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import professionalTypes from 'modules/Auth/actions/professionalTypes';
import countries from 'modules/Auth/actions/countries';
import presenter from './presenter';
import { get } from 'lodash';
import selectors from './selectors';
import provinces from "../../actions/provinces";

interface IStateProps {
  isUserAuthed: boolean,
  countries: ISelectOption[],
  provinces: ISelectOption[],
  countryId: string,
  registerFormState: any,
}

interface IDispatchProps {
  loadProfessionalTypes: Function,
  searchCountries: Function,
  searchProvinces: Function,
  goToRoot: Function,
  storeCountry: Function,
  storeProvince: Function,
}

interface ISelectOption {
  value: string,
  label: string
}

interface IRegisterProps extends IStateProps, IDispatchProps {}

class Register extends Component<IRegisterProps, { selectedCountry: ISelectOption, selectedProvince: ISelectOption }> {
  constructor() {
    super();
    this.state = {
      selectedCountry: null,
      selectedProvince: null,
    };
  }
  componentWillMount() {
    if (this.props.isUserAuthed) {
      this.props.goToRoot();
    }
    this.props.loadProfessionalTypes();
  }
  render() {
    const countries = [...this.props.countries];
    if (this.state.selectedCountry) {
      countries.unshift(this.state.selectedCountry);
    }
    const provinces = [...this.props.provinces];
    if (this.state.selectedProvince) {
      provinces.unshift(this.state.selectedProvince);
    }
    return presenter({
      ...this.props,
      countries,
      provinces,
      storeCountry: (id) => this.storeCountry(id),
      storeProvince: (id) => this.storeProvince(id),
      countryId: this.state.selectedCountry ? this.state.selectedCountry.value : null,
      provinceId: this.state.selectedProvince ? this.state.selectedProvince.value : null,
    });
  }

  storeCountry(id) {
    this.setState({
      selectedCountry: this.props.countries.find( (option : ISelectOption) => option.value === id),
    });
  }

  storeProvince(id) {
    this.setState({
      selectedProvince: this.props.provinces.find(option => option.value === id),
    });
  }
}

function mapStateToProps(state): IStateProps {

  const countries = selectors.getCountries(state);
  const provinces = selectors.getProvinces(state);
  const registerFormState = get(state, 'form.register.values', {});

  return {
    isUserAuthed: !!state.auth.core.token,
    countries,
    provinces,
    countryId: state.countryId,
    registerFormState,
  };
}

const mapDispatchToProps = {
    goToRoot: goToPage.bind(null, '/'),
    loadProfessionalTypes: professionalTypes.load,
    doSearchCountries: (data) => countries.query(data),
    doSearchProvinces: (data) => provinces.query(data),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    searchCountries: (data) => {
      const query = get(data, 'query', '') || '';
      return dispatchProps.doSearchCountries({
        query,
        includeId: !query ? stateProps.countryId : -1,
      });
    },
    searchProvinces: (data) => {
      const query = get(data, 'query', '') || '';
      return dispatchProps.doSearchProvinces({
        query,
        countryId: (stateProps.registerFormState.address && stateProps.registerFormState.address.country) || stateProps.countryId || 'US',
        includeId: !query ? stateProps.provinceId : -1,
      });
    }
  };
}

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )
(Register);
