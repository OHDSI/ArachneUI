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
 * Created: May 29, 2018
 *
 */

import React from 'react';

import {
  TabbedPane,
  Fieldset,
  Button,
  Link
} from 'arachne-ui-components';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { getDataSourceCreationFields, getDataSourceKerberosFields } from 'const/dataSource';
import { kerberosAuthType } from 'modules/CdmSourceList/const';

require('./style.scss');

function TabbedForm(props) {

  const classes = new BEMHelper('tabbed-form');

  function isFieldVisible(field) {
    return (field.name !== 'krbPassword' && field.name !== 'krbKeytab' )
      || (field.name === 'krbPassword' && authMethod === kerberosAuthType.PASSWORD)
      || (field.name === 'krbKeytab' && authMethod === kerberosAuthType.KEYTAB);
  }

  function KeytabControl({ hasKeytab } = props) {
    return hasKeytab ?
      (<div>
        <div {...classes('keytab')}><i {...classes('icon')}>lock</i><span>Previously uploaded Keytab is used for authentication</span></div>
        <div {...classes('keytab')}><Link {...classes('link')} onClick={deleteKeytab}>Remove Keytab</Link></div>
      </div>) : null;
  }

  function mapField() {
    return ((field, key) => [
        field.InputComponent && field.InputComponent.props && field.InputComponent.props.title
          ? <span {...classes('group-title')}>{field.InputComponent.props.title}</span>
          : null,
        field.name === 'krbKeytab' && authMethod === kerberosAuthType.KEYTAB ? <KeytabControl {...props} /> : null,
        isFieldVisible(field) ? <Field {...field} {...classes('group', field.mods, field.className)} component={Fieldset} key={key}/> : null,
      ]
    )
  }

  const {
    dbmsTypeList,
    authMethod,
    openedSection,
    hasKeytab,
    deleteKeytab,
    onTabChange,
    /* redux-form props */
    error,
    handleSubmit,
    submitting,
  } = props;

  const fields = getDataSourceCreationFields(dbmsTypeList).map(mapField());
  const kerberosFields = getDataSourceKerberosFields().map(mapField());

  const sections = [
    {
      id: 'datasource-fields',
      label: 'General',
      content: fields,
    },
    {
      id: 'kerberos-fields',
      label: 'Kerberos',
      content: kerberosFields,
    },
  ];

  let submitBtn;
  if (props.dataSourceId) {
    submitBtn  = {
      label: 'Save',
      loadingLabel: 'Saving...',
    }
  } else {
    submitBtn = {
      label: 'Create',
      loadingLabel: 'Creating...',
    }
  }

  const cancelBtn = {
    label: 'Cancel',
  };

  return (<form
    {...classes({mods: 'form'})}
    onSubmit={handleSubmit(props.doSubmit)}>
    <TabbedPane
      sections={sections}
      value={openedSection}
      onChange={onTabChange}
    />
    <div {...classes({element: 'actions'})}>
      <Button
        {...classes({ element: 'submit', extra: submitBtn.className })}
        mods={['submit', 'rounded']}
        type="submit"
        disabled={submitBtn.disabled || submitting}
        label={submitting ? submitBtn.loadingLabel : submitBtn.label}
      />
      <Button
        {...classes({ element: 'cancel', extra: cancelBtn.className })}
        mods={cancelBtn.mods || ['cancel', 'rounded']}
        type="button"
        onClick={props.modal.close}
        disabled={submitting}
        label={cancelBtn.label}
      />
    </div>
  </form>);
}

export default TabbedForm;