import * as React from 'react';
import {
  Button,
  LoadingPanel,
  Toolbar,
  Table,
  TableCellText,
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import { paths, bundleStatuses } from 'modules/Vocabulary/const';
import * as moment from 'moment';

require('./style.scss');

interface IVocabulary {
  id: number;
  code: string;
  name: string;
  cdmVersion: string;
}

interface IDownloadRequest {
  id: number;
  date: number;
  link: string;
  vocabularies: Array<IVocabulary>;
  cdmVersion: number;
  name: string;
  status: string;
};

interface IHistoryItem extends IVocabulary {
  date?: string;
  link?: string;
  tableRowClass: string;
};

interface IDownloadHistoryStateProps {
  isLoading: boolean;
  history: Array<IDownloadRequest>,
};

interface IDownloadHistoryDispatchProps {
  load: () => (dispatch: Function) => any;
  remove: (id: number) => Promise<void>;
};

interface IDownloadHistoryProps extends IDownloadHistoryStateProps, IDownloadHistoryDispatchProps {
  removeBundle: (id: number) => any;
};

function BundleName({ name, date }) {
  const dateFormat = 'h:mm A | MM/DD/YYYY';
  const classes = BEMHelper('bundle-caption');

  return <div {...classes()}>
    {name}
    <span {...classes('date')}>{moment(date).format(dateFormat)}</span>
  </div>;
}

function VocabsList(props: IDownloadHistoryProps) {
  const { isLoading, history, removeBundle } = props;
  const classes = BEMHelper('download-history');

  return (    
    <div {...classes()}>
      <Toolbar caption='Download history' backUrl={paths.vocabsList()} />
      <div>
        {history && history.map((bundle: IDownloadRequest, index: number) => [
            <div
              {...classes('bundle-caption')}
              key={`caption${index}`}
            >
              <Toolbar
                caption={<BundleName {...bundle} />}
              >
                {[bundleStatuses.READY].includes(bundle.status) &&
                  <div>
                    <Button
                      {...classes('download-button')}
                      link={bundle.link}
                      mods={['rounded']}
                    >
                      Download
                    </Button>
                    <Button
                      {...classes('remove-button')}
                      onClick={() => removeBundle(bundle.id)}
                    >
                      Remove
                  </Button>
                  </div>
                }
              </Toolbar>
             </div>,
            <Table
              {...classes('table')}
              data={bundle.vocabularies}
              mods={['hover', 'padded', 'selectable']}
              key={`table${index}`}
             >
                {/* <TableCellText
                  header=''
                  field='date'
                />
                <CellButton
                  header=''
                  field='link'
                  props={() => ({
                    ...classes('download-button')
                  })}
                /> */}
                <TableCellText
                  header='ID'
                  field='id'
                />
                <TableCellText
                  header='CDM'
                  field='cdmVersion'
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
          ]
        )}
      </div>
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
