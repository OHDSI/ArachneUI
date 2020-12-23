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
  * Created: Monday, February 26, 2018 4:17 PM
  *
  */

import React from 'react';
import {
  Modal,
  FacetedSearchPanel as FacetedSearch,
  Button,
  Checkbox,
  FormCheckboxList,
  FormToggle,
  Fieldset,
} from 'arachne-ui-components';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { submissionFilters } from 'modules/AnalysisExecution/const';
import LabelSubmissionStatus from 'components/LabelSubmissionStatus';

import './style.scss';

function SubmissionsTableFilter(props) {
  const classes = new BEMHelper('submissions-table-filter');
  const {
    modal,
    doSubmit,
    doClear,
    handleSubmit,
    fieldValues,
    isAnyDatasourceId,
    isAnySubmissionStatus,
    checkAll,
    uncheckAll,
  } = props;
  const {
    dataSourceIds,
    submissionStatuses,
  } = fieldValues;
  
  const fields = {
    showHidden: {
      name: `filter[${submissionFilters.showHidden.name}]`,
      InputComponent: {
        component: FormToggle,
        props: {
          label: submissionFilters.showHidden.label,
        },
      },
    },
    hasInsight: {
      name: `filter[${submissionFilters.hasInsight.name}]`,
      InputComponent: {
        component: FormToggle,
        props: {
          label: submissionFilters.hasInsight.label,
        },
      },
    },
    dataSourceIds: {
      name: `filter[${submissionFilters.dataSourceIds.name}]`,
      InputComponent: {
        component: FormCheckboxList,
        props: {
          options: dataSourceIds.map((source, idx) => ({
            label: <span key={idx} {...classes('datasource')} title={source.label}>{source.label}</span>,
            value: source.value,
          })),
          label: submissionFilters.dataSourceIds.label,
          ...classes('ds-list-container'),
        },
      },
    },
    submissionStatuses: {
      name: `filter[${submissionFilters.submissionStatuses.name}]`,
      InputComponent: {
        component: FormCheckboxList,
        props: {
          options: submissionStatuses.map(({ label, value }, idx) =>
            ({
              label: <LabelSubmissionStatus key={idx} status={{ title: label, value }} type={'dot'} />,
              value,
            })
          ),
          label: submissionFilters.submissionStatuses.label,
        },
      },
    },
  };

  return (
    <Modal
      modal={modal}
      title="Filter submissions table"
      mods={['no-padding']}
    >
      <div {...classes()}>
        <form onSubmit={props.handleSubmit(doSubmit)}>
          <div {...classes('section')}>
            <Field component={Fieldset} {...fields.showHidden} />
          </div>
          <div {...classes('section')}>
            <Field component={Fieldset} {...fields.hasInsight} />
          </div>
          <div {...classes('section-title')}>Datasource</div>
          <div {...classes('section', 'cols')}>
            <Checkbox
              {...classes('any-button')}
              label={'Any'}
              isChecked={isAnyDatasourceId}
              onChange={(event) => {
                isAnyDatasourceId
                  ? uncheckAll('dataSourceIds')
                  : checkAll('dataSourceIds');
              }
              }
            />
            <Field component={Fieldset} {...fields.dataSourceIds} />
          </div>
          <div {...classes('section-title')}>Status</div>
          <div {...classes('section', 'cols')}>
            <Checkbox
              {...classes('any-button')}
              label={'Any'}
              isChecked={isAnySubmissionStatus}
              onChange={(event) => {
                isAnySubmissionStatus
                  ? uncheckAll('submissionStatuses')
                  : checkAll('submissionStatuses');
              }
              }
            />
            <Field component={Fieldset} {...fields.submissionStatuses} />
          </div>
          <div {...classes('actions')}>
            <Button type={'submit'} mods={['rounded', 'submit']} disabled={props.submitting}>
              Update
            </Button>
            <Button {...classes('cancel')} mods={['rounded', 'cancel']} onClick={doClear}>
              Clear
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default SubmissionsTableFilter;
