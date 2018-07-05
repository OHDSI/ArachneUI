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
  Table,
  TableCellText as Cell,
  Checkbox,
  Link,
} from 'arachne-ui-components';
import { push } from 'react-router-redux';
import { Field, FormProps } from 'redux-form';
import { licenseStatuses } from 'const/vocabulary';
import { Vocabulary } from './selectors';

require('./style.scss');

interface IDownloadCheckboxProps {
  options: {
    className: string;
  };
  input: any;
};

interface ICellProps {
  className: string;
  isCheckable: boolean;
  name: string;
};

interface IResultsStateProps {
  areAllChecked: boolean | Object;
  areAllRowsChecked: boolean;
  sorting: string;
  vocabularies: Array<Vocabulary>;
  initialValues: Object;
};

interface IResultsDispatchProps {
  toggleAll: (on: boolean) => (dispatch: Function) => any;
  toggle: (id: number, on: boolean) => (dispatch: Function) => any;
  openRequestModal: Function;
};

interface IResultsProps extends IResultsStateProps, IResultsDispatchProps {
  toggleAllCheckboxes: () => (dispatch: Function) => any;
  setSorting: Function;
};

interface IResultsOwnProps {
  predefinedVocabs: Array<string>;
};

function DownloadCheckbox(props: IDownloadCheckboxProps) {
  const { options, /*redux-form*/ input } = props;
  return (<Checkbox
      className={options.className}
      isChecked={input.value}
    />);
}

function CellChecked(props: any) {
  const { className, isCheckable, name } = props;
  
  return isCheckable
    ? <Field component={DownloadCheckbox} options={{ className }} name={name} />
    : null;
}

function CellLicense(props: any) {
  const { className, value, openRequestModal, isPending, isCheckable, notAvailable } = props;
  const classes = BEMHelper('cell-license');
  if (!value) {
    return null;
  }
  if (isCheckable) {
    return <span>{value}</span>;
  } else if (isPending) {
    return <Link {...classes()}>
        <span {...classes({ element: 'icon', extra: `${className}--disabled` })}>
          timer
        </span> {value}
      </Link>;
  } else {
    return <Link {...classes({ extra: notAvailable ? '' : 'ac-tooltip' })}
          aria-label='Click to request access'
          data-tootik-conf='right'
          onClick={() => {
            if (notAvailable) {
              return false;
            }
            openRequestModal();
          }}>
          <span {...classes({ element: 'icon', extra: `${className}--disabled` })}>
            vpn_key
          </span>
        {value}
      </Link>;
  }

}

function Results(props: IResultsProps & FormProps<{}, {}, {}>) {
  const {
    areAllRowsChecked,
    vocabularies,
    sorting,
    setSorting,
    toggleAllCheckboxes,
    toggle,
    openRequestModal,
  } = props;
  const classes = BEMHelper('vocabularies');
  const selectAllButton = <Checkbox onChange={toggleAllCheckboxes} isChecked={areAllRowsChecked} />;
  // add modifiers for Table component
  vocabularies.map((vocabulary) => {
    if (vocabulary.isChecked) {
    vocabulary.tableRowClass = classes('selected-row').className;
    }
  });

  return (
    <div {...classes()}>
      <Table
        {...classes('table')}
        data={vocabularies}
        mods={['hover', 'padded', 'selectable']}
        sorting={sorting}
        setSorting={setSorting}
        onRowClick={(vocab: Vocabulary) => {
            if(vocab.isCheckable) {
              toggle(vocab.id, !vocab.isChecked);
            }
          }
        }
      >
        <CellChecked
          {...classes('selection')}
          header={selectAllButton}
          field='isChecked'
          props={(vocab: Vocabulary) => ({
            isCheckable: vocab.isCheckable,
            name: `vocabulary[${vocab.id}]`,
            className: classes({
              element: 'cell',
              modifiers: {
                unclickable: vocab.isCheckable,
              },
            }).className,
          })}
         />
        <Cell
          {...classes('id')}
          header='ID (CDM v4.5)'
          field='id'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <Cell
          {...classes('code')}
          header='CODE (CDM v5)'
          field='code'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <Cell
          {...classes('name')}
          header='Name'
          field='name'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
        <CellLicense
          {...classes('required')}
          header='Required'
          field='required'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
            isPending: vocab.status === licenseStatuses.PENDING,
            openRequestModal: () => openRequestModal(vocab),
            isCheckable: vocab.isCheckable,
            notAvailable: vocab.required === 'Currently not available',
          })}
        />
        <Cell
          {...classes('update')}
          header='Latest Update'
          field='update'
          props={(vocab: Vocabulary) => ({              
            className: classes({
              element: 'cell',
              modifiers: {
                selected: vocab.isChecked,
              },
            }).className,
          })}
        />
      </Table>
    </div>
  );
}

export default Results;
export {
  IResultsStateProps,
  IResultsDispatchProps,
  IResultsProps,
  IResultsOwnProps,
};
