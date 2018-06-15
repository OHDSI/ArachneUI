/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: April 10, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Field } from 'redux-form';
import { Button, Link, ListItem, Form } from 'arachne-ui-components';

require('./style.scss');

function Links(props) {
  const classes = new BEMHelper('modal-upload-link');
  const wrapperClasses = new BEMHelper('modal-links-upload-actions');
  const tooltipClasses = new BEMHelper('tooltip');
  const {
    options,

    input,
    meta,
  } = props;
  let links = [];
  if (Array.isArray(input.value)) {
    links = links.concat(input.value);
  }
  let canSubmit = links.length > 0;
  links.forEach((link) => {
    if (link.label.length === 0 || link.value.length === 0) {
      canSubmit = false;
    }
  });

  return <div {...wrapperClasses()}> 
    <ul className={options.className}>
      {links.map((link, index) =>
        <ListItem
          {...classes()}
          key={index}
          mods={options.isMultiple ? ['removable', 'borderless'] : ['borderless']}
          onRemove={() => {
            links.splice(index, 1);
            input.onChange(links);
          }}
        >
          <span 
            {...classes({ element: 'input-wrapper', extra: tooltipClasses().className })}
            aria-label="Label"
          >
            <input
              {...classes('input')}
              placeholder="Label"
              value={link.label}
              onChange={(evt) => {
                links[index] = {
                  label: evt.target.value,
                  value: link.value,
                };
                input.onChange(links);
              }}
              placeholder={options.placeholder}
              disabled={meta.submitting}
            />
          </span>
          <span
            {...classes({ element: 'input-wrapper', extra: tooltipClasses().className })}
            aria-label="Link to file"
          >
            <input
              {...classes('input')}
              placeholder="Link to file"
              value={link.value}
              onChange={(evt) => {
                links[index] = {
                  label: link.label,
                  value: evt.target.value,
                };
                input.onChange(links);
              }}
              disabled={meta.submitting}
            />
          </span>
        </ListItem>
      )}
    </ul>
    {options.isMultiple ?
      <Link
        {...wrapperClasses('add-button')}
        onClick={options.addLink}
      >
        <span {...wrapperClasses('icon')}>add_circle_outline</span>
        <span {...wrapperClasses('label')}>{options.addButtonTitle}</span>
      </Link>
    :
      null}
  </div>;
}

function ModalLinksUploader(props) {
  const classes = new BEMHelper('modal-links-upload');
  const isMultiple = typeof props.multiple !== 'undefined' ? props.multiple : true;
  const modifiers = {
    single: !props.isMultiple,
  };
  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
    disabled: !props.canSubmit,
  };

  return <div {...classes({ modifiers })}>
    <Form
      {...props}
      onSubmit={props.doSubmit}
      fields={[
        {
          name: props.fieldName,
          InputComponent: {
            component: Links,
            props: {
              options: {
                placeholder: 'Name document',
                isMultiple,
                ...classes('links'),
                addLink: props.addLink,
                addButtonTitle: props.addButtonTitle,
                doSubmit: props.doSubmit,
              },
            },
          },
        },
      ]}
      submitBtn={submitBtn}
    />
  </div>;
}

ModalLinksUploader.propTypes = {
  addLink: PropTypes.func.isRequired,
  addButtonTitle: PropTypes.string.isRequired,
  doSubmit: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default ModalLinksUploader;
