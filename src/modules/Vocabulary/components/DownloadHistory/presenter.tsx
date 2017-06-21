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
import {
  Accordion,
  AccordionItem,
} from 'react-sanfona';

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

interface IDownloadHistoryStatefulProps {
  expand: (id: number) => any;
  expandedBundleId: number;
};

function BundleName({ name, date, onClick, isOpened }) {
  const dateFormat = 'h:mm A | MM/DD/YYYY';
  const classes = BEMHelper('bundle-caption');

  return <div {...classes()} onClick={onClick}>
    <span {...classes({ element: 'opener', modifiers: { opened: isOpened } })}>keyboard_arrow_right</span>
    <div {...classes('title-wrapper')}>
      {name}
      <span {...classes('date')}>{moment(date).format(dateFormat)}</span>
     </div>
  </div>;
}

function BundleTitle({ bundle, removeBundle, expand, isExpanded }) {
  const classes = BEMHelper('download-history');

  return <Toolbar
    caption={<BundleName {...bundle} onClick={() => expand(bundle.id)} isOpened={isExpanded} />}
  >
    {[bundleStatuses.READY].includes(bundle.status)
      ? <div>
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
     : <span {...classes('status')}>{bundle.status}</span>
    }
  </Toolbar>;
}

function VocabsList(props: IDownloadHistoryProps & IDownloadHistoryStatefulProps) {
  const { isLoading, history, removeBundle, expand, expandedBundleId } = props;
  const classes = BEMHelper('download-history');

  return (    
    <div {...classes()}>
      <Toolbar caption='Download history' backUrl={paths.vocabsList()} />
        <Accordion activeItems={[expandedBundleId]}>
          {history && history.map((bundle: IDownloadRequest, index: number) =>
            <AccordionItem
              title={<BundleTitle
                bundle={bundle}
                removeBundle={removeBundle}
                expand={expand}
                isExpanded={bundle.id === expandedBundleId}
               />}
              {...classes('bundle-caption')}
              key={`caption${index}`}
              slug={bundle.id}
            >
              <Table
                {...classes('table')}
                data={bundle.vocabularies}
                mods={['hover', 'padded', 'selectable']}
               >
                  <TableCellText
                    {...classes('id')}
                    header='ID'
                    field='id'
                  />
                  <TableCellText
                    {...classes('cdm')}
                    header='CDM'
                    field='cdmVersion'
                  />
                  <TableCellText
                    {...classes('code')}
                    header='Code (cdm v5)'
                    field='code'
                  />
                  <TableCellText
                    {...classes('name')}
                    header='Name'
                    field='name'
                  />
              </Table>          
            </AccordionItem>
        )}
      </Accordion>
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
