/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 27, 2016
 *
 */

import React from 'react';

import { PageContent, LoadingPanel } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import MediaViewer from 'components/MediaViewer';
import BlockingInviteBanner from 'components/Banners/BlockingInvite';

import Toolbar from './Toolbar/index';
import Editor from './Editor/index';
import ConfirmDialog from './ConfirmDialog';
import ModalRequestUnlock from './ModalRequestUnlock';


require('./style.scss');

function AnalysisCode({
  isLoading,
  pageTitle,
  isTextFile,
  downloadLink,
  mimeType,
  content,
  title,
  createdAt,
  language,
  studyId,
  analysisId,
  analysisCodeId,
  isEditable,
  onBannerActed,
}) {
  const classes = new BEMHelper('analysis-code');

  return (
    <PageContent title={pageTitle}>
      <div {...classes()}>
        <BlockingInviteBanner
          id={analysisCodeId}
          studyId={studyId}
          onAction={onBannerActed}
        >
          <Toolbar />
          <div {...classes('content')}>
            {isTextFile && isEditable ? <Editor language={language} /> :
            <MediaViewer
              language={language}
              mimeType={mimeType}
              data={content}
              downloadLink={downloadLink}
              name={name}
              title={title}
              createdAt={createdAt}
            />
            }
          </div>
        </BlockingInviteBanner>
        <LoadingPanel active={isLoading} />
        <ConfirmDialog />
        <ModalRequestUnlock />
      </div>
    </PageContent>
  );
}

export default AnalysisCode;
