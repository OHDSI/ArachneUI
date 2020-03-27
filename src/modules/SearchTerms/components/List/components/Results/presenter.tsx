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
  Table,
  TableCellLink as CellLink,
  TableCellText as Cell,
} from 'arachne-ui-components';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { push } from 'react-router-redux';
import Pagination from '../Pagination';

require('./style.scss');

type Term = {
  id: number;
  code: string;
  className: string;
  class: string;
  rc: string;
  drc: string;
  domain: string;
  vocabulary: string;
  link: string;
};

type SortingParams = {
  sortBy: string;
  sortAsc: boolean;
};

interface IResultStateProps {
  searchResults: Term[];
  downloadingEnabled: boolean;
  sorting: SortingParams;
  searchLocation: locationDescriptor;
  downloadLink: string;
};

interface IResultDispatchProps {
  search: (address: string) => typeof push;
};

interface IResultOwnProps {};

interface IResultProps extends IResultStateProps, IResultDispatchProps, IResultOwnProps {
  showResult: Function;
  sorting: SortingParams;
  setSorting: Function;
}

function Results(props: IResultProps) {
  const {
    downloadLink,
    searchResults,
    showResult,
    sorting,
    setSorting,
    downloadingEnabled,
  } = props;
  const classes = BEMHelper('search-results');
  const tooltipClass = BEMHelper('ac-tooltip', false);

  return (
    <div {...classes()}>
      <div {...classes('management-panel')}>
      <div
        {...classes({
          element: 'download-button-wrapper',
          extra: downloadingEnabled ? '' : tooltipClass().className,
        })}
        aria-label='Enter at least 3 letters of keyword'
        data-tootik-conf='bottom'
       >
        <Button
          {...classes({
            element: 'download-button',
            modifiers: {
              disabled: !downloadingEnabled
            }
          })}
          mods={['rounded']}
          link={downloadLink}
          target='_self'
        >
          Download results
        </Button>
        </div>
        <Pagination resultsCount={searchResults.length}/>
      </div>
      <div {...classes('table-wrapper')}>
        <Table
          {...classes('table')}
          data={searchResults}
          mods={['hover', 'selectable']}
          onRowClick={showResult}
          sorting={sorting}
          setSorting={setSorting}
        >
          <Cell
            {...classes('id')}
            header='ID'
            field='id'
          />
          <Cell
            {...classes('code')}
            header='CODE'
            field='code'
          />
          <CellLink
            {...classes('name')}
            header='NAME'
            field='name'
            props={(result: { [key: string]: string }) => {
              const { name, link } = result;
              return {
                value: {
                  label: name,
                  link: link,
                },
              }
            }}
          />
          <Cell
            {...classes('class')}
            header='CLASS'
            field='className'
          />
          <Cell
            {...classes('concept')}
            header='Concept'
            field='standardConcept'
          />
          <Cell
            {...classes('invalid')}
            header='Validity'
            field='invalidReason'
          />
          <Cell
            {...classes('domain')}
            header='DOMAIN'
            field='domain'
          />
          <Cell
            {...classes('vocabulary')}
            header='Vocab'
            field='vocabulary'
          />
        </Table>
      </div>
    </div>
  );
}

export default Results;
export {
  IResultProps,
  IResultStateProps,
  IResultDispatchProps,
  IResultOwnProps,
  Term,
  SortingParams,
};
