/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import ReactDOM from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import BEMHelper from 'services/BemHelper';
import OriginalViewer from 'react-viewer';
import OriginalViewerCore from 'react-viewer/lib/ViewerCore';
import Loadable from 'react-loadable';
import EmptyState from 'components/EmptyState';
import { isText } from 'services/MimeTypeUtil';
import { Button, LoadingPanel, Pagination } from 'arachne-ui-components';
import MimeTypes from 'const/mimeTypes';
import CodeViewer from 'components/CodeViewer';
import moment from 'moment-timezone';
import { usDateTime as dateFormat } from 'const/formats';
import CSV from './CsvViewer';
import { getScanResultDescription } from 'const/antivirus';

class ViewerCore extends OriginalViewerCore {
  render() {
    // Workarounds for:

    // 1) React-viewer plugin has hardcoded "transitionDuration"
    // If duration between the switch from visible = false to visible = true is less than the hardcoded duration (300ms),
    // new image won't show up. See "componentWillReceiveProps" and "render" -> "if (!this.state.visible && this.state.visibleStart) {"

    // 2) The plugin waits for the "transitionend" event and displays content only after the event has taken place
    return super.render.apply(Object.assign(cloneDeep(this), { state: { ...this.state, visible: this.props.visible, transitionEnd: true, visibleStart: true } }));
  }
}

class Viewer extends OriginalViewer {

  removeViewer() {
    this.props.onClose();
    if (this.container) {
      this.container = null;
      this.component = null;
    }
  }

  // Copy-paste of the original method just to reference extended ViewerCore
  renderViewer() {
    if (this.props.visible || this.component) {
      if (!this.container) {
        if (this.props.container) {
          this.container = this.props.container;
        } else {
          this.container = this.defaultContainer;
          document.body.appendChild(this.container);
        }
      }
      let instance = this;
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        <ViewerCore
          {...this.props}
        />,
        this.container,
        function () {
          instance.component = this;
        },
      );
    }
  }
}

let ReactPDF;

require('./style.scss');

export function ActionBar(props = {}) {
  const classes = new BEMHelper('action-bar');
  const {
    downloadLink,
    title,
    createdAt,
    antivirusStatus,
    antivirusDescription,
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
      <div
        {...classes('actions', '', antivirusStatus ? 'ac-tooltip' : '')}
        aria-label={getScanResultDescription(antivirusStatus, antivirusDescription)}
        data-tootik-conf={'left'}
      >
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
    <div
      {...classes('container')}
      id="media-viewer-container"
      ref={(element) => {
        if (element && !container) {
          setContainer(element);
        }
      }}
    >
      <Viewer
        attribute={false}
        images={[{ src: `data:image;base64,${data}` }]}
        visible={data !== null}
        container={container}
        zIndex={10}
        onClose={() => {
          setContainer(null);
        }}
      />
    </div>
  );
}

function pdf({
  classes,
  container,
  data,
  setContainer,
  onPDFLoaded,
  pageIndex,
  path,
  totalPages,
  scale,
  zoomIn,
  zoomOut,
  isLoaded,
  isInitialScaleSet,
  setInitialScale,
}) {
  let pdfWidth = null;
  let pdfHeight = null;
  if (container) {
    pdfWidth = container.getBoundingClientRect().width - 17;
    pdfHeight = container.getBoundingClientRect().height - 36;
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
      {container &&
        <div>
          {isLoaded &&
            <div {...classes('zoom')}>
              <div {...classes('zoom-control')} onClick={zoomIn}>+</div>
              <div {...classes('scale')}>{parseInt(scale * 100, 10)} %</div>
              <div {...classes('zoom-control')} onClick={zoomOut}>-</div>
            </div>
          }
          <div {...classes('pdf')}>
            {data &&
              <ReactPDF
                file={`data:application/pdf;base64,${data}`}
                loading={<EmptyState message={'Loading PDF'} />}
                error={<EmptyState message={'Failed to load PDF'} />}
                noData={<EmptyState message={'No PDF file specified'} />}
                onDocumentError={<EmptyState message={'Error while loading document'} />}
                onPageError={<EmptyState message={'Error while loading page'} />}
                width={pdfWidth * scale}
                pageIndex={pageIndex - 1}
                onDocumentLoad={onPDFLoaded}
                onPageLoad={(page) => {
                  if (!isInitialScaleSet) {
                    setInitialScale(pdfHeight / page.height);
                  }
                }}
              />
            }
          </div>
          <div {...classes('pagination')}>
            <Pagination pages={totalPages} currentPage={pageIndex} path={path} />
          </div>
        </div>
      }
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
    (<div {...classes({ element: 'container', modifiers: 'empty' })}>
      <EmptyState message={'Content of this file cannot be displayed'} />
    </div>)
  );
}

function MediaViewer({
  language,
  onPDFLoaded,
  pageIndex,
  path,
  data,
  mimeType,
  setContainer,
  container,
  totalPages,
  downloadLink,
  name,
  title,
  createdAt,
  scale,
  zoomIn,
  zoomOut,
  isLoaded,
  isInitialScaleSet,
  setInitialScale,
  antivirusStatus,
  antivirusDescription,
}) {
  const classes = new BEMHelper('media-viewer');
  let element;
  let isDownloadLinkWrapperNeeded = true;

  switch (mimeType) {
    case MimeTypes.image:
      element = image({ classes, container, setContainer, data });
      break;
    case MimeTypes.word:
    case MimeTypes.excel:
    case MimeTypes.ppt:
    case MimeTypes.pdf:
      element = (
        <LazyPDF {...{ classes, container, data, setContainer, totalPages, path, pageIndex, onPDFLoaded, scale, zoomIn, zoomOut, isLoaded, isInitialScaleSet, setInitialScale }} />
      );
      break;
    case MimeTypes.csv:
      element = (
        <CSV data={data} adaptiveColumns={true} />
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
            antivirusStatus={antivirusStatus}
            antivirusDescription={antivirusDescription}
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
      <ActionBar
        downloadLink={downloadLink}
        title={title}
        antivirusStatus={antivirusStatus}
        antivirusDescription={antivirusDescription}
      />
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
