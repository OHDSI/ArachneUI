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
 * Created: February 15, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { reduxForm, reset as resetForm } from 'redux-form';
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { forms } from 'modules/ExpertFinder/const';
import presenter from './presenter';
import selectors from './selectors';

class ContactInfoEdit extends Component {
  componentWillMount() {
    this.props.searchCountries();
    if (this.props.countryId) {
      this.props.searchProvinces({ countryId: this.props.countryId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const data = get(moduleState, 'data.general', {
    address1: '',
    address2: '',
    city: '',
    stateProvince: { id: -1, name: '' },
    zipCode: '',
    country: { id: -1, name: '' },
    phone: '',
    mobile: '',
    contactEmail: '',
  });

  const id = get(moduleState, 'data.id', '');
  const countryId = get(data, 'country.id', null);
  const stateProvinceId = get(data, 'stateProvince.id', null);

  return {
    initialValues: {
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      stateProvince: stateProvinceId,
      zipCode: data.zipCode,
      country: countryId,
      phone: data.phone,
      mobile: data.mobile,
      contactEmail: data.contactEmail,
    },
    contactInfoFormState: get(state, 'form.contactInfo.values', {}),
    id,
    countryId,
    stateProvinceId,
    provinces: selectors.getProvinces(state),
    countries: selectors.getCountries(state),
  };
}

const mapDispatchToProps = {
  resetForm: resetForm.bind(null, forms.contactInfo),
  updateGeneralInfo: actions.expertFinder.userProfile.updateGeneralInfo,
  loadInfo: actions.expertFinder.userProfile.loadInfo,
  searchCountries: actions.expertFinder.countries.search,
  searchProvinces: actions.expertFinder.provinces.search,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    cancel: () => ownProps.setViewMode(),
    searchCountries: (data) => {
      const query = get(data, 'query', null);

      return dispatchProps.searchCountries({
        query,
        includeId: !query ? stateProps.countryId : -1,
      });
    },
    searchProvinces: (data) => {
      const query = get(data, 'query', null);

      return dispatchProps.searchProvinces({
        countryId: stateProps.contactInfoFormState.country || stateProps.countryId,
        query,
        includeId: !query ? stateProps.stateProvinceId : -1,
      });
    },
    doSubmit: (data) => {
      const submitPromise = dispatchProps.updateGeneralInfo(data);
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => ownProps.setViewMode())
        .then(() => dispatchProps.loadInfo(stateProps.id))
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
