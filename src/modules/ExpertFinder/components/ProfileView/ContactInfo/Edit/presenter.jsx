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

import React, { PropTypes } from 'react';
import { Form, FormInput, FormSelect } from 'arachne-ui-components';
import StatefulFormAutocomplete from 'components/StatefulFormAutocomplete';
import { submitBtnConfig, cancelBtnConfig } from 'modules/ExpertFinder/const';

function getStateFieldProps(canSelectState) {
  const wrapperClassName = canSelectState
    ? ''
    : 'ac-tooltip';

  return {
    wrapperClassName,
    ariaLabel: 'Select country first',
  };
}

function ContactInfoEdit(props) {
  const {
    className,
    cancel,
    countries,
    provinces,
    searchCountries,
    searchProvinces,
    canSelectState,
  } = props;

  const formFields = [
    {
      name: 'address1',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Address line 1',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
    {
      name: 'address2',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Address line 2',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
    {
      name: 'city',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'City',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
    {
      name: 'zipCode',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Zip code',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
    {
      name: 'country',
      InputComponent: {
        component: StatefulFormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'Country',
          options: countries,
          fetchOptions: searchCountries,
          clearable: false,
          onSelectResetsInput: true,
          onBlurResetsInput: true,
          storeSelectedOption: props.storeCountry,
        }
      }
    },
    {
      name: 'stateProvinceId',
      InputComponent: {
        component: StatefulFormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'State',
          options: provinces,
          fetchOptions: searchProvinces,
          clearable: false,
          disabled: !canSelectState,
          storeSelectedOption: props.storeProvince,
          onSelectResetsInput: true,
          onBlurResetsInput: true,
          ...getStateFieldProps(canSelectState),
        }
      }
    },
    {
      name: 'phone',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Office phone',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
    {
      name: 'mobile',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Mobile phone',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
    {
      name: 'contactEmail',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Contact email',
          type: 'text',
          mods: 'bordered'
        },
      },
    },
  ];

  return (
    <Form
      className={className}
      cancelBtn={cancelBtnConfig}
      fields={formFields}
      mods={['actions-inline']}
      onSubmit={ props.doSubmit }
      onCancel={props.cancel}
      submitBtn={{
        ...submitBtnConfig,
        label: 'Save',
        loadingLabel: 'Saving...',
      }}
      {...props}
    />
  );
}

ContactInfoEdit.PropTypes = {
  cancel: PropTypes.func,
};
export default ContactInfoEdit;
