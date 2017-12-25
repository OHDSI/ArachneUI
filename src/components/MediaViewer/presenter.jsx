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
import BEMHelper from 'services/BemHelper';
import Viewer from 'react-viewer';
import Loadable from 'react-loadable';
import EmptyState from 'components/EmptyState';
import { isText } from 'services/MimeTypeUtil';
import { Button, LoadingPanel, Pagination } from 'arachne-ui-components';
import MimeTypes from 'const/mimeTypes';
import CodeViewer from 'components/CodeViewer';
import moment from 'moment-timezone';
import { usDateTime as dateFormat } from 'const/formats';
import CSV from './CsvViewer';

let ReactPDF;

require('./style.scss');

export function ActionBar(props = {}) {
  const classes = new BEMHelper('action-bar');
  const {
    downloadLink,
    title,
    createdAt,
  } = props;
  return (
    <div {...classes()}>
      <div {...classes('info')}>
        {title && <div {...classes('title')}>
          {title}
        </div>}
        {createdAt && <span>
          Created at {moment(createdAt).tz(moment.tz.guess()).format(dateFormat)}
        </span>}
      </div>
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

const LazyPDF = Loadable({
  loader: () => new Promise((resolve) => {
    require.ensure([], (require) => {
      ReactPDF = require('react-pdf/build/entry.webpack');
      resolve(pdf);
    });
  }),
  loading: LoadingPanel,
});

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

  switch (mimeType) {
    case MimeTypes.image:
      element = image({ classes, container, setContainer, data });
      break;
    case MimeTypes.pdf:
      element = (
        <LazyPDF { ...{ classes, container, data, setContainer, totalPages, path, pageIndex, onPDFLoaded } } />
      );
      break;
    case MimeTypes.csv:
      element = (
        <CSV data={data} />
      );
      break;
    default:
      if (isText(mimeType)) {
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
      break;
  }

  return isDownloadLinkWrapperNeeded ? (
    <div {...classes()}>
      <ActionBar downloadLink={downloadLink} title={title} />
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
