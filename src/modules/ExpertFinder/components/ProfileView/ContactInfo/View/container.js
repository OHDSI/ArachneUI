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

import { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';
import selectors from '../Edit/selectors';

class ContactInfoView extends Component {
  
  componentWillReceiveProps(nextProps) {    
    if (this.props.countryId !== nextProps.countryId && nextProps.countryId) {
      this.props.searchProvinces({ countryId: nextProps.countryId });
    }
  }

  render() {
    return presenter(this.props);
  }
  
}

function mapStateToProps(state) {
  const data = get(state, 'expertFinder.userProfile.data.result.general', {});
  const stateId = get(data, 'stateProvinceId')
  const countryId = get(data, 'country.id')
  const states = selectors.getProvinces(state);

  return {
    address1: get(data, 'address1'),
    address2: get(data, 'address2'),
    city: get(data, 'city'),
    state: get(states.find(state => state.value === stateId), 'label', null),
    zipCode: get(data, 'zipCode'),
    country: get(data, 'country.name'),
    phone: get(data, 'phone'),
    mobile: get(data, 'mobile'),
    contactEmail: get(data, 'contactEmail'),
    countryId,
  };
}

const mapDispatchToProps = {
  searchProvinces: actions.expertFinder.provinces.query,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    searchProvinces: ({ countryId }) => {
      return dispatchProps.searchProvinces({
        countryId,
        query: '',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ContactInfoView);
