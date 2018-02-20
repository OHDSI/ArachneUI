import * as React from 'react';
import {
  PageContent,
  LoadingPanel,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import ControlPanel from './components/ControlPanel';
import Results  from './components/Results';
import ModalConfirmDownload from './components/ModalConfirmDownload';
import ModalDownloadResult from './components/ModalDownloadResult';
import ModalRequestLicense from './components/ModalRequestLicense';
import ModalConfirmLicense from './components/ModalConfirmLicense';

require('./style.scss');

interface IListStateProps {
  isLoading: boolean;
};
interface IListDispatchProps {
  load: () => (dispatch: Function) => any;
};
interface IListProps extends IListStateProps, IListDispatchProps {};

function VocabsList(props: IListProps) {
  const { isLoading } = props;
  const classes = BEMHelper('vocabs');

  return (    
    <div {...classes()}>
      <ControlPanel />
      <Results />
      <ModalConfirmDownload />
      <ModalDownloadResult />
      <ModalRequestLicense />
      <ModalConfirmLicense />
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default VocabsList;
export {
  IListStateProps,
  IListDispatchProps,
  IListProps,
};
