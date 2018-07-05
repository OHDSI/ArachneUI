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
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';
import { FormSelect } from 'arachne-ui-components';
import { LoadingPanel } from 'arachne-ui-components';
import { paths, registerFields } from 'modules/Auth/const';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function FormRegister(props) {

  const submitBtn = {
    label: 'Register',
    loadingLabel: 'Registering...',
  };
  const classes = new BEMHelper('form-register');

  return (
    <div {...classes()}>
      <Form fields={registerFields(props)} submitBtn={submitBtn} onSubmit={props.doSubmit} {...props} />
      <span {...classes('login-caption')}>
        Already Registered? <Link to={paths.login()}>Login here</Link>
      </span>
      <LoadingPanel active={props.isLoading} />
    </div>
  );
}

FormRegister.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  doSubmit: PropTypes.func.isRequired,
  professionalTypesOptions: PropTypes.array.isRequired,
};

export default FormRegister;
