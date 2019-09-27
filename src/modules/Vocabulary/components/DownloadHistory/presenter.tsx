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
import {
  Button,
  LoadingPanel,
  Toolbar,
  Table,
  TableCellText,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { paths, bundleStatuses } from 'modules/Vocabulary/const';
import * as moment from 'moment';
import {
  Accordion,
  AccordionItem,
} from 'react-sanfona';
import { fullDateFormat } from 'const/formats';
import ModalEditNotifications from './components/ModalEditNotifications';
import ModalRequestLicenses from './components/ModalRequestLicenses';
import ModalShare from './components/ModalShare';

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
  currentUser: string;
};

interface IDownloadHistoryDispatchProps {
  load: () => (dispatch: Function) => any;
  remove: (id: number) => Promise<void>;
  restore: (id: number) => Promise<void>;
  share: (id: number) => Promise<void>;
  showNotifications: Function;
  checkAvailability: Function;
  showRequestModal: Function;
  showShareModal: Function;
};

interface IDownloadHistoryProps extends IDownloadHistoryStateProps, IDownloadHistoryDispatchProps {
  removeBundle: (id: number) => any;
  restoreBundle: (id: number) => any;
  download: (bundle: IDownloadRequest) => any;
};

interface IDownloadHistoryStatefulProps {
  toggle: (id: number) => any;
  expandedBundleId: number;
};

function BundleName({ name, date, onClick, isOpened, releaseVersion, downloadShareDTO, currentUser }) {
  const dateFormat = fullDateFormat;
  const classes = BEMHelper('bundle-caption');
  const isAlreadyShared = downloadShareDTO && downloadShareDTO.ownerUsername === currentUser;
  return <div {...classes()} onClick={onClick}>
    <span {...classes({ element: 'opener', modifiers: { opened: isOpened } })}>keyboard_arrow_right</span>
    <div {...classes('title-wrapper')}>
      {name}
      <span {...classes('date')}>{moment(date).format(dateFormat)}</span>
      <span {...classes('version')}>{releaseVersion}</span>
      {downloadShareDTO && !isAlreadyShared && <span {...classes('shared-by')}>Shared by {downloadShareDTO.ownerUsername}</span>}
     </div>
  </div>;
}

function BundleTitle({ bundle, removeBundle, toggle, isExpanded, restore, download, share, showShareModal, currentUser }) {
  const classes = BEMHelper('download-history');
  const isAlreadyShared = bundle.downloadShareDTO && bundle.downloadShareDTO.ownerUsername === currentUser;
  const isShareable = isAlreadyShared || !bundle.downloadShareDTO;
  const shareBtnTitle = isAlreadyShared ? 'Edit share' : !bundle.downloadShareDTO ? 'Share' : '';
  return <Toolbar
    caption={<BundleName {...bundle} onClick={() => toggle(bundle.id)} isOpened={isExpanded} currentUser={currentUser} />}
  >
    {[bundleStatuses.READY].includes(bundle.status)
      ? <div>
          <Button
            {...classes('download-button')}
            onClick={() => download(bundle)}
            mods={['rounded']}
          >
            Download
          </Button>
          {isShareable && (
            <Button
            {...classes('share-button')}
            onClick={() => showShareModal(bundle)}
            mods={['rounded']}
          >
            {shareBtnTitle}
          </Button>
          )}

          {isShareable && (
            <Button
              {...classes('remove-button')}
              onClick={() => removeBundle(bundle.id)}
            >
              Archive
            </Button>
          )}
      </div>
     : <div>
         <span {...classes('status')}>{bundle.status}</span>
         {bundle.status === bundleStatuses.ARCHIVED && isShareable &&
           <Button
             {...classes('restore-button')}
             mods={['success', 'rounded']}
             onClick={() => restore(bundle.id)}
           >
             Restore
           </Button>
         }
       </div>
    }
  </Toolbar>;
}

function VocabsList(props: IDownloadHistoryProps & IDownloadHistoryStatefulProps) {
  const {
    isLoading,
    history,
    removeBundle,
    toggle,
    expandedBundleId,
    restoreBundle,
    share,
    showNotifications,
    showShareModal,
    download,
    currentUser,
  } = props;
  const classes = BEMHelper('download-history');

  return (
    <div {...classes()}>
      <Toolbar
        caption='Download history'
        backUrl={paths.vocabsList()}
      >
        <Button onClick={showNotifications} mods={['submit', 'rounded']}>Notifications</Button>
      </Toolbar>
      <Accordion activeItems={[expandedBundleId]}>
        {history && history.map((bundle: IDownloadRequest, index: number) =>
          <AccordionItem
            title={<BundleTitle
              bundle={bundle}
              removeBundle={removeBundle}
              toggle={toggle}
              isExpanded={bundle.id === expandedBundleId}
              restore={restoreBundle}
              download={download}
              share={share}
              showShareModal={showShareModal}
              currentUser={currentUser}
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
      <ModalEditNotifications />
      <ModalRequestLicenses />
      <ModalShare />
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
