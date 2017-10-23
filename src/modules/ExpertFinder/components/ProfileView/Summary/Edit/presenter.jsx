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
 * Created: January 16, 2017
 *
 */

import React, { PropTypes } from 'react';
import { Form } from 'arachne-ui-components';
import { FormTextarea } from 'arachne-ui-components';
import { submitBtnConfig, cancelBtnConfig } from 'modules/ExpertFinder/const';

function SummaryEdit(props) {
  const {
    className,
    text,
  } = props;

  const formFields = [
    {
      name: 'text',
		    InputComponent: {
		    	component: FormTextarea,
		      props: {
		        placeholder: 'About me',
		        required: false,
		        type: 'text',
		        value: props.text,
		      },
		    }
		  },
  ];
  return (
    <Form
      className={className}
      cancelBtn={cancelBtnConfig}
      fields={formFields}
      mods={['actions-inline']}
      onSubmit={props.doSubmit}
      onCancel={props.cancel}
      submitBtn={submitBtnConfig}
      {...props}
  	/>
  );
}

SummaryEdit.PropTypes = {
  text: PropTypes.string,
};
export default SummaryEdit;
