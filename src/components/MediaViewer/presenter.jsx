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
 * Created: August 11, 2017
 *
 */

import React, { PropTypes } from 'react';
import ReactPDF from 'react-pdf/build/entry.webpack';
import BEMHelper from 'services/BemHelper';
import Viewer from 'react-viewer';
import EmptyState from 'components/EmptyState';
import { isText } from 'services/MimeTypeUtil';
import { Button, Pagination } from 'arachne-ui-components';
import MimeTypes from 'const/mimeTypes';
import CodeViewer from 'components/CodeViewer';

require('./style.scss');

function ActionBar(props = {}) {
  const classes = new BEMHelper('action-bar');
  const {
    downloadLink,
  } = props;
  return (
    <div {...classes()}>
      <div {...classes('actions')}>
        {downloadLink && <Button
          {...classes('btn', 'download')}
          label="Download"
          mods={['submit', 'rounded']}
          link={downloadLink}
          target="_self"
        />}
      </div>
    </div>
  );
}

function image({ classes, container, setContainer, data }) {
  return (
  [
    <div
      {...classes('container')}
      id="media-viewer-container"
      ref={(element) => {
        if (element && !container) {
          setContainer(element);
        }
      }}
    />,
    container && data ?
      <Viewer
        attribute={false}
        images={[{ src: `data:image;base64,${data}` }]}
        visible
        container={container}
        onClose={() => {
        }}
      /> : null,
  ]
  );
}

function pdf({ classes, container, data, setContainer, onPDFLoaded, pageIndex, path, totalPages }) {
  let pdfWidth = null;
  if (container) {
    pdfWidth = container.getBoundingClientRect().width - 17;
  }

  return (
    (<div
      {...classes({ element: 'container', modifiers: { loading: totalPages === null } })}
      ref={(element) => {
        if (element && !container) {
          setContainer(element);
        }
      }}
    >
      <ReactPDF
        file={`data:application/pdf;base64,${data}`}
        loading={<EmptyState message={'Loading PDF'} />}
        error={<EmptyState message={'Failed to load PDF'} />}
        noData={<EmptyState message={'No PDF file specified'} />}
        onDocumentError={<EmptyState message={'Error while loading document'} />}
        onPageError={<EmptyState message={'Error while loading page'} />}
        width={pdfWidth}
        pageIndex={pageIndex-1}
        onDocumentLoad={onPDFLoaded}
      />
      <Pagination pages={totalPages} currentPage={pageIndex} path={path} />
    </div>)
  );
}

function empty({ classes }) {
  return (
    (<div {...classes({ element: 'container' })}>
      <EmptyState message={'Content of this file cannot be displayed'} />
    </div>)
  );
}

function MediaViewer({ language, onPDFLoaded, pageIndex, path, data, mimeType, setContainer, container, totalPages, downloadLink, name, title, createdAt }) {
  const classes = new BEMHelper('media-viewer');
  let element;
  let isDownloadLinkWrapperNeeded = true;

  if (mimeType === MimeTypes.image) {
    element = image({ classes, container, setContainer, data });
  } else if (mimeType === MimeTypes.pdf) {
    element = pdf({ classes, container, data, setContainer, totalPages, path, pageIndex, onPDFLoaded });
  } else if (isText(mimeType)) {
    element = (
      <CodeViewer
        language={language}
        value={data}
        name={name}
        title={title}
        createdAt={createdAt}
        downloadLink={downloadLink}
      />
    );
    isDownloadLinkWrapperNeeded = false;
  } else {
    element = empty({ classes });
  }

  return isDownloadLinkWrapperNeeded ? (
    <div {...classes()}>
      <ActionBar downloadLink={downloadLink} />
      {element}
    </div>
  ) : element;
}

MediaViewer.propTypes = {
  data: PropTypes.string,
  mimeType: PropTypes.string.isRequired,
  setContainer: PropTypes.func,
  container: PropTypes.node,
  totalPages: PropTypes.number,
  downloadLink: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  createdAt: PropTypes.date,
};


export default MediaViewer;
