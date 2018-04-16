/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Form,
  FormInput,
} from 'arachne-ui-components';
import { push } from 'react-router-redux';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { searchParams } from 'modules/SearchTerms/actions/termList';

require('./style.scss');

interface IToolbarStateProps {
  initialValues: { [key: string]: Object };
  locationSearch: locationDescriptor;
  filterParams: searchParams,
}

interface IToolbarDispatchProps {
  search: (address: string) => typeof push;
  updateFacets: (params: searchParams) => (dispatch: Function) => any;
}

interface IToolbarProps extends IToolbarStateProps, IToolbarDispatchProps {
  filter: Function;
}

function Toolbar(props: IToolbarProps) {
  const classes = BEMHelper('search-toolbar');
  const fields = [
    {
      name: 'searchString',
      InputComponent: {
        component: FormInput,
        props: {
          ...classes('input'),
          placeholder: 'aspirin',
        }
      }
    }
  ];
  const submitBtn = {
    label: 'search',
    ...classes('search-button'),
    mods: ['clear'],
  };

  return (
    <div {...classes()}>
    	<div {...classes({ element: 'title-wrapper' })}>
    		<span {...classes('title')}>Search by keyword</span>
    	</div>
    	<div {...classes({ element: 'search-string' })}>
        <Form
          fields={fields}
          onSubmit={props.filter}
          submitBtn={submitBtn}
          actionsClassName={classes('search-button-wrapper').className}
          {...props}
        />
    	</div>
    </div>
  );
}

export default Toolbar;
export { IToolbarProps, IToolbarStateProps, IToolbarDispatchProps };
