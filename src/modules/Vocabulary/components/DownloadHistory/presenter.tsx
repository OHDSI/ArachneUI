import * as React from 'react';
import {
  Button,
  LoadingPanel,
  Toolbar,
  Table,
  TableCellText,
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Vocabulary/const';

require('./style.scss');

interface IVocabulary {
  id: number;
  code: string;
  name: string;
}

interface IDownloadRequest {
  date: number;
  link: string;
  vocabularies: Array<IVocabulary>;
};

interface IHistoryItem extends IVocabulary {
  date?: string;
  link?: string;
  tableRowMods: {
    selected: boolean
  };
};

interface IDownloadHistoryStateProps {
  isLoading: boolean;
  history: Array<IHistoryItem>,
};

interface IDownloadHistoryDispatchProps {
  load: () => (dispatch: Function) => any;
};

interface IDownloadHistoryProps extends IDownloadHistoryStateProps, IDownloadHistoryDispatchProps {};

function CellButton(props) {

  return props.value
    ? <Button
        link={props.value}
        mods={['rounded']}
        className={props.className}
      >
        Download
      </Button>
    : null;
}

function VocabsList(props: IDownloadHistoryProps) {
  const { isLoading, history } = props;
  const classes = BEMHelper('download-history');

  return (    
    <div {...classes()}>
      <Toolbar caption='Download history' backUrl={paths.vocabsList()} />
      <Table
        {...classes('table')}
        data={history}
        mods={['hover', 'padded', 'selectable']}
       >
          <TableCellText
            header=''
            field='date'
          />
          <CellButton
            header=''
            field='link'
            props={() => ({
              ...classes('download-button')
            })}
          />
          <TableCellText
            header='ID'
            field='id'
          />
          <TableCellText
            header='Code (cdm v5)'
            field='code'
          />
          <TableCellText
            header='Name'
            field='name'
          />
      </Table>
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default VocabsList;
export {
  IDownloadHistoryStateProps,
  IDownloadHistoryDispatchProps,
  IDownloadHistoryProps,
  IHistoryItem,
  IDownloadRequest,
  IVocabulary,
};
