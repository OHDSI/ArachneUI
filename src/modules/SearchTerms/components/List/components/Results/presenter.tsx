import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Table,
  TableCellLink as CellLink,
  TableCellText as Cell,
} from 'arachne-components';
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
        >
          Download results
        </Button>
        </div>
        <Pagination resultsCount={searchResults.length}/>
      </div>
      <Table
        {...classes('table')}
        data={searchResults}
        mods={['hover', 'padded', 'selectable']}
        onRowClick={showResult}
        sorting={sorting}
        setSorting={setSorting}
      >
        <Cell
          {...classes('th-id')}
          header='ID'
          field='id'
        />
        <Cell
          {...classes('th-code')}
          header='CODE'
          field='code'
        />
        <CellLink
          {...classes('th-name')}
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
          {...classes('th-class')}
          header='CLASS'
          field='className'
        />
        <Cell
          {...classes('th-standard')}
          header='Standard concept'
          field='standardConcept'
        />
        <Cell
          {...classes('th-invalid')}
          header='Invalid reason'
          field='invalidReason'
        />
        <Cell
          {...classes('th-domain')}
          header='DOMAIN'
          field='domain'
        />
        <Cell
          {...classes('th-vocabulary')}
          header='VOCABULARY'
          field='vocabulary'
        />
      </Table>
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
