/*
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

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function BasicInfoView(props) {
	const classes = new BEMHelper('profile-contact-info-view');
  const {
    address1,
    address2,
    city,
    state,
    zipCode,
    country,
    phone,
    mobile,
    contactEmail,
  } = props;

  return (
  	<div {...classes('content')}>
      <div {...classes({ element: 'attr', modifiers: { empty: !(address1 || address2) } })}>
        {(address1 || address2) ?
          <span>{[address1, address2].filter(val => !!val).join(', ')}</span>
          :
          <span>Address line 1, Address line 2</span>
        }
      </div>
      <div {...classes({ element: 'attr', modifiers: { empty: !(city || state || zipCode) }})}>
        {(city || state || zipCode) ?
          <span>{[city, state, zipCode].filter(val => !!val).join(', ')}</span>
          :
          <span>City, State, Zip</span>
        }
      </div>
      <div {...classes({ element: 'attr', modifiers: { empty: !country } })}>
        {country || 'Country'}
      </div>
      <div {...classes({ element: 'attr', modifiers: { empty: !(phone || mobile || contactEmail) }})}>
        {(phone || mobile || contactEmail) ?
          <span>{[phone, mobile, contactEmail].filter(val => !!val).join(', ')}</span>
          :
          <span>Office phone, Mobile, Contact email</span>
        }
      </div>
    </div>
  );
}

BasicInfoView.PropTypes = {
  address1: PropTypes.string,
  address2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  zipCode: PropTypes.string,
  country: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  phone: PropTypes.string,
  mobile: PropTypes.string,
  contactEmail: PropTypes.string,
};

export default BasicInfoView;
