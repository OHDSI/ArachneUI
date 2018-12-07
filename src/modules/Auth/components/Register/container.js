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
 * Created: December 14, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import actions from 'actions/index';
import get from 'lodash/get';
import { leaveIfAuthed } from 'modules/Auth/utils';
import presenter from './presenter';
import selectors from './selectors';

class Register extends Component {

  constructor(){
    super();
    this.state = {
      selectedCountry: null,
      selectedProvince: null,
    };
  }

  componentWillMount() {
    leaveIfAuthed(this.props);
    this.props.loadProfessionalTypes();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUserAuthed !== nextProps.isUserAuthed) {
      leaveIfAuthed(nextProps);
    }
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
      countryId: this.state.selectedCountry ? this.state.selectedCountry.value : null,
      provinceId: this.state.selectedProvince ? this.state.selectedProvince.value : null,
    });
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
}

Register.propTypes = {
  goToRoot: PropTypes.func.isRequired,
  isUserAuthed: PropTypes.bool.isRequired,
  loadProfessionalTypes: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {

  const countries = selectors.getCountries(state);
  const provinces = selectors.getProvinces(state);
  const registerFormState = get(state, 'form.register.values', {});

  return {
    isUserAuthed: !!get(state, 'auth.principal.queryResult.result.id'),
    registerFormState,
    countries,
    provinces,
  };
}

const mapDispatchToProps = {
  goToRoot: goToPage.bind(null, '/'),
  loadProfessionalTypes: actions.auth.professionalType.query,
  searchCountries: actions.auth.countries.query,
  searchProvinces: actions.auth.provinces.query,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
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
        countryId: (stateProps.registerFormState.address && stateProps.registerFormState.address.country) || stateProps.countryId,
        includeId: !query ? stateProps.provinceId : - 1,
      })
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Register);
