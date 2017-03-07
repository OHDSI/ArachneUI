import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Table,
  TableCellLink as CellLink,
  TableCellText as Cell,
} from 'arachne-components';
import Pagination from '../Pagination';

require('./style.scss');

type SearchResult = {
  id: number;
  code: string;
  name: string;
  class: string;
  rc: string;
  drc: string;
  domain: string;
  vocabulary: string;
  link: string;
};

interface IResultStateProps {
  searchResults: SearchResult[];
};

interface IResultDispatchProps {};

interface IResultOwnProps {};

interface IResultProps extends IResultStateProps, IResultDispatchProps, IResultOwnProps {
  download: () => void;
  showResult: () => void;
}

function Results(props: IResultProps) {
  const {
    download,
    searchResults,
    showResult,
  } = props;
  const classes = BEMHelper('search-results');

  return (
    <div {...classes()}>
      <div {...classes('management-panel')}>
        <Button {...classes('download-button')} mods={['rounded']} onClick={download}>
          Download results
        </Button>
        <Pagination resultsCount={searchResults.length}/>
      </div>
      <Table
        data={searchResults}
        mods={['hover', 'padded', 'selectable']}
        onRowClick={showResult}
      >
        <Cell
          {...classes('th')}
          header='ID'
          field='id'
        />
        <Cell
          {...classes('th')}
          header='CODE'
          field='code'
        />
        <CellLink
          {...classes('th-wide')}
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
          field='class'
        />
        <Cell
          {...classes('th')}
          header='RC'
          field='rc'
        />
        <Cell
          {...classes('th')}
          header='DRC'
          field='drc'
        />
        <Cell
          {...classes('th')}
          header='DOMAIN'
          field='domain'
        />
        <Cell
          {...classes('th')}
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
  SearchResult
};
