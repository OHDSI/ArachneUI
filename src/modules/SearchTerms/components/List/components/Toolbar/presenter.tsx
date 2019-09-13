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
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Form,
  FormInput,
  Panel,
} from 'arachne-ui-components';
import { push } from 'react-router-redux';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
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

function SearchTooltip() {
  const classes = BEMHelper('search-tooltip-dropdown');
  return (
    <Dropdown {...classes()}>
    <DropdownTrigger {...classes('icon')}>
      <i {...classes('search-tooltip-icon')}>help_outline</i>
    </DropdownTrigger>
    <DropdownContent>
      <Panel title="Here are several options to use the search:" mods="black-header" {...classes('content')}>
        <div {...classes('search-tooltip-text')}>
          <ol>
            <li>Usage of quotation marks forces an exact-match search</li>
            <li>In case of a typo, or if there is a similar spelling of the word, the most similar result will be presented</li>
            <li>
              In case of search for a phrase, results are sorted according to the following criteria:
              <ul>
                <li>full phrase match</li>
                <li>concepts contain all the words from the search phrase</li>
                <li>result based on the number of matching words in the result and importance of each word (rearer words come first)</li>
              </ul>
            </li>
            <li>
              For special symbols, the rules below are applied:
              <ul>
                <li>The following special symbols are always ignored and treated as words separation symbols: / \ | ? ! , ; .</li>
                <li>All other special symbols are ignored only if they form a separate word: + - ( ) : ^ [ ] { } ~ * ? | & ;</li>
                <li>Results including the special symbols are ranked higher</li>
              </ul>
            </li>
          </ol>
        </div>
      </Panel>
    </DropdownContent>
  </Dropdown>
  )
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
      <SearchTooltip />
    </div>
  );
}

export default Toolbar;
export { IToolbarProps, IToolbarStateProps, IToolbarDispatchProps };
