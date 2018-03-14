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
 * Created: January 22, 2018
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  BadgedIcon,
  Autocomplete,
  Form,
  Link,
} from 'arachne-ui-components';

import './style.scss';

function SearchResult(props) {
  const classes = BEMHelper('search-navbar-input-result');
  const {
    value,
    label,
    caption,
    path,
  } = props;
  
  return (<span {...classes()}>
    <span>{label}</span>
    <span {...classes('caption')}>{caption}</span>
  </span>);
}

function Input({
  input,
  fetchResults,
  results,
  classes,
  isCollapsed,
  setIsCollapsed,
  reference,
  optionRenderer,
  showResults,
}) {
  return (
    <div {...classes({ element: 'input-wrapper', modifiers: { collapsed: isCollapsed } })}>
      <Autocomplete
        placeholder='Search...'
        fetchOptions={fetchResults}
        value={input.value}
        onChange={(value) => {
          if (value !== null) {
            showResults(value);
          }
          input.onChange(value);
        }}
        onBlur={() => setIsCollapsed(true)}
        options={results}
        reference={reference}
        optionRenderer={optionRenderer}
        useSearchIcon={false}
      />
    </div>
  );
}

export default function NavbarSearchInput(props) {
  const {
    isCollapsed,
    setIsCollapsed,
    setInput,
    fetchResults,
    results,
    showResults,
  } = props;
  const classes = BEMHelper('search-navbar-input');
  const fields = [
    {
      name: 'searchQuery',
      InputComponent: {
        component: Input,
        props: {
          fetchResults,
          results,
          classes,
          isCollapsed,
          setIsCollapsed,
          reference: (el) => {
            if (el) {
              setInput(el);
            }
          },
          optionRenderer: SearchResult,
          showResults,
        },
      },
    },
  ];

  return (
    <div {...classes()}>
      <Form {...props} fields={fields} mods={['horizontal']} />
      <BadgedIcon
        {...classes('icon')}
        icon='search'
        onMouseDown={(evt) => {
          evt.preventDefault();
          setIsCollapsed(!isCollapsed);
        }}
      />
    </div>
  );
}
