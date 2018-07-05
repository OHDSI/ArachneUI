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
  predefinedVocabs: Array<string>;
};
interface IListDispatchProps {
  load: () => (dispatch: Function) => any;
};
interface IListProps extends IListStateProps, IListDispatchProps {};

function VocabsList(props: IListProps) {
  const { isLoading, predefinedVocabs } = props;
  const classes = BEMHelper('vocabs');

  return (    
    <div {...classes()}>
      <ControlPanel />
      <Results predefinedVocabs={predefinedVocabs} />
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
