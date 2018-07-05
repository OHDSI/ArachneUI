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
 * Created: February 15, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { reduxForm, reset as resetForm } from 'redux-form';
import { Component, PropTypes } from 'react';
import actions from 'actions';
import uniqBy from 'lodash/uniqBy';
import { forms } from 'modules/ExpertFinder/const';
import presenter from './presenter';
import selectors from './selectors';

class ContactInfoEdit extends Component {
  constructor() {
    super();
    this.state = {
      selectedCountry: null,
      selectedProvince: null,
    };
    this.storeCountry = this.storeCountry.bind(this);
    this.storeProvince = this.storeProvince.bind(this);
  }

  componentWillMount() {
    this.props.searchCountries();
    if (this.props.countryId) {
      this.props.searchProvinces({ countryId: this.props.countryId });
    }
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
    if (this.state.selectedCountry) {
      countries.unshift(this.state.selectedCountry);
    }

    const provinces = [...this.props.provinces];
    if (this.state.selectedProvince) {
      provinces.unshift(this.state.selectedProvince);
    }

    return presenter({
      ...this.props,
      storeCountry: this.storeCountry,
      storeProvince: this.storeProvince,
      countries: uniqBy(countries, 'value'),
      provinces: uniqBy(provinces, 'value'),
    });
  }
}

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const data = get(moduleState, 'data.result.general', {
    address1: '',
    address2: '',
    city: '',
    stateProvinceId,
    zipCode: '',
    country: { id: -1, name: '' },
    phone: '',
    mobile: '',
    contactEmail: '',
  });

  const id = get(moduleState, 'data.result.id', '');
  const countryId = get(data, 'country.id', null);
  const stateProvinceId = get(data, 'stateProvinceId', null);
  const countries = selectors.getCountries(state);
  const provinces = selectors.getProvinces(state);
  const contactInfoFormState = get(state, 'form.contactInfo.values', {}); 
  
  return {
    initialValues: {
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      stateProvinceId,
      zipCode: data.zipCode,
      country: countryId,
      phone: data.phone,
      mobile: data.mobile,
      contactEmail: data.contactEmail,
    },
    contactInfoFormState,
    id,
    countryId,
    stateProvinceId,
    provinces,
    countries,
    canSelectState: contactInfoFormState.country !== null,
  };
}

const mapDispatchToProps = {
  resetForm: resetForm.bind(null, forms.contactInfo),
  updateGeneralInfo: actions.expertFinder.userProfile.generalInfo.update,
  loadInfo: actions.expertFinder.userProfile.find,
  searchCountries: actions.expertFinder.countries.query,
  searchProvinces: actions.expertFinder.provinces.query,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    cancel: () => ownProps.setViewMode(),
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
        countryId: stateProps.contactInfoFormState.country || stateProps.countryId,
        query,
        includeId: !query ? stateProps.stateProvinceId : -1,
      });
    },
    doSubmit: (data) => {
      const submitPromise = dispatchProps.updateGeneralInfo(null, 
        {...data,
          country: {
            id: data.country
          }
        }
      );
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => ownProps.setViewMode())
        .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
        .catch(() => {});

      return submitPromise;
    },
  };
}

ContactInfoEdit.propTypes = {
  countryId: PropTypes.number,
  searchCountries: PropTypes.func,
  searchProvinces: PropTypes.func,
};

const ReduxContactInfoEdit = reduxForm({
  form: forms.contactInfo,
  enableReinitialize: true,
})(ContactInfoEdit);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxContactInfoEdit);
