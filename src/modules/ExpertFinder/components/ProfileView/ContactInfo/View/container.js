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
import ContactInfoView from './presenter';

function mapStateToProps(state) {
  const data = get(state, 'expertFinder.userProfile.data.general', {});

  return {
    address1: get(data, 'address1'),
    address2: get(data, 'address2'),
    city: get(data, 'city'),
    state: get(data, 'stateProvince.name'),
    zipCode: get(data, 'zipCode'),
    country: get(data, 'country.name'),
    phone: get(data, 'phone'),
    mobile: get(data, 'mobile'),
    contactEmail: get(data, 'contactEmail'),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfoView);
