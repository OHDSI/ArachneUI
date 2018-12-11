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

import * as React from 'react';
import {
  Link,
  Form,
  FormInput,
  FormSelect,
  FormAutocomplete,
  LoadingPanel,
} from 'arachne-ui-components';
import { paths } from 'modules/Auth/const';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

interface IFormRegisterProps {
  isLoading: boolean,
  doSubmit: Function,
  professionalTypesOptions: any,
};

function StatefulFormAutocomplete(props) {
  const input = {
    ...props.input,
    onChange: (option) => {
      props.storeSelectedOption(option);
      return props.input.onChange(option);
    }
  };
  return <FormAutocomplete
    {...props}
    input={input}
  />;
}

function FormRegister(props) {
  const fields = [
    {
      name: 'firstname',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'First Name',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.address1',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Address',
          type: 'text',
          required: true,
        }
      }
    },
    {
      name: 'middlename',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Middle Name',
          type: 'text',
        },
      },
    },
    {
      name: 'address.city',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'City',
          type: 'text',
          required: true,
        }
      }
    },
    {
      name: 'lastname',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Last Name',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.zipCode',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Zip code',
          type: 'text',
          required: true,
        }
      }
    },
    {
      name: 'email',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Email',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.country',
      InputComponent: {
        component: StatefulFormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'Country',
          required: true,
          options: props.countries,
          fetchOptions: props.searchCountries,
          clearable: false,
          onSelectResetsInput: true,
          onBlurResetsInput: true,
          storeSelectedOption: props.storeCountry,
        }
      }
    },
    {
      name: 'password',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Password',
          type: 'password',
          required: true,
        },
      },
    },
    {
      name: 'address.stateProvince',
      InputComponent: {
        component: StatefulFormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'State/Province',
          options: props.provinces,
          fetchOptions: props.searchProvinces,
          clearable: false,
          onSelectResetsInput: true,
          onBlurResetsInput: true,
          storeSelectedOption: props.storeProvince,
        }
      }
    },
    {
      name: 'organization',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Organization',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.mobile',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Mobile',
          type: 'text',
        }
      }
    },
    {
      name: 'department',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Department',
          type: 'text',
        }
      },
    },
    {
      name: 'professionalTypeId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Professional type',
          options: props.professionalTypes,
          required: true,
        },
      },
    },
  ];
  const submitBtn = {
    label: 'Register',
    loadingLabel: 'Registering...',
  };
  const classes = BEMHelper('form-register');

  return (
    <div {...classes()}>
      <div {...classes('title-pane')}>
        <div {...classes('column-title')}>General</div>
        <div {...classes('column-title')}>Contact Info</div>
      </div>
      <Form
        fields={fields}
        submitBtn={submitBtn}
        onSubmit={props.doSubmit}
        {...props}
      />
      <span {...classes('login-caption')}>
        Already Registered? <Link to={paths.login()}>Login here</Link>
      </span>
      <LoadingPanel active={props.isLoading} />
    </div>
  );
}

export default FormRegister;
