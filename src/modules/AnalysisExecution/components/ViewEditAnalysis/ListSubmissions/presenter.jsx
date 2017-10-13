/**
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
import BEMHelper from 'services/BemHelper';
import { Button, Link, Panel, Table } from 'arachne-ui-components';
import { StickyContainer, Sticky } from 'react-sticky';
import get from 'lodash/get';
import {
  paths,
  statusColors,
  submissionActionTypes,
} from 'modules/AnalysisExecution/const';
import LabelDataSource from 'components/LabelDataSource';
import LabelSubmissionStatus from 'components/LabelSubmissionStatus';

require('./style.scss');

function CellResults({ className, filesCount, showList, canUploadResult, showUploadForm }) {
  const classes = new BEMHelper('submissions-cell-files');

  return (
    <div {...classes({ extra: className })}>
      {canUploadResult &&
      <Link {...classes('add-link')} onClick={showUploadForm}>
        add_circle_outline
      </Link>
      }
      {filesCount > 0 ?
        <Link onClick={showList}>
          <span>{filesCount} {filesCount === 1 ? 'document' : 'documents'}</span>
        </Link>
        :
        <span>No documents</span>
      }
    </div>
  );
}

function CellStatus({ status, showStatusHistory, comment }) {
  const classes = new BEMHelper('submissions-cell-status');

  return (
    <div {...classes()}>
      <Button {...classes('button')} onClick={showStatusHistory}>
        <LabelSubmissionStatus mods="detailed" status={status} />
      </Button>
      {comment &&
        <div
          className='ac-tooltip'
          aria-label={`Comment: ${comment}`}
          data-tootik-conf='bottom multiline'
        >
          <span
            {...classes({ element: 'comment-ico' })}
          >comment</span>
        </div>
      }
    </div>
  );
}

function CellActions(props) {
  const classes = new BEMHelper('submissions-cell-actions');
  const {
    actionState: {
      available,
      result,
      hasPermsission,
    } = {},
    className,
    doSubmit,
    doCancel,
  } = props;

  const mods = {
    disabled: !hasPermsission || result !== null,
    future: !available && result === null,
  };
  const doneMods = { submit: true, ...mods };
  const clearMods = { cancel: true, ...mods };
  return (
    <div {...classes({ extra: className })}>
      {(result === null || result === true) &&
      <Button
        {...classes({ element: 'btn', modifiers: doneMods })}
        mods={['success']}
        ico="done"
        onClick={() => {
          if (result === null && available) {
            return doSubmit();
          }
        }}
      >done</Button>
      }
      {(result === null || result === false) &&
      <Button
        {...classes({ element: 'btn', modifiers: clearMods })}
        mods={['cancel', 'submit']}
        ico="close"
        onClick={() => {
          if (result === null && available) {
            return doCancel();
          }
        }}
      >clear</Button>
      }
    </div>
  );
}

function CellInsight({ hasInsight, isDisabled, name, showCreateInsight, submissionId }) {
  const classes = new BEMHelper('submissions-insight-ico');
  const tooltipClass = new BEMHelper('tooltip');

  if (isDisabled) {
    return (
      <i 
        {...classes({
          modifiers: ['disabled'],
          extra: tooltipClass().className
        })}
        aria-label={ 'No results are available yet' }
        data-tootik-conf="left"
      ></i>
    );
  }
  else if (hasInsight) {
    return (
      <Link to={paths.insight({ submissionId })}>
        <i 
          {...classes({
            modifiers: ['active'],
            extra: tooltipClass().className
          })}
          aria-label={`Show insight "${name}"`}
          data-tootik-conf="left"
        ></i>
      </Link>
    );
  }
  else {
    return (
      <Link onClick={() => showCreateInsight(submissionId)}>
        <i 
          {...classes({ extra: tooltipClass().className })}
          aria-label="Create insight"
          data-tootik-conf="left"
        ></i>
      </Link>
    );
  }
}

function SubmissionsHeader(props) {
  const classes = new BEMHelper('submissions-header');
  const {
    isSticky,
    style,
  } = props;

  if (isSticky) {
    style.top = '56px';
  }

  return (
    <div {...classes({ modifiers: { 'sticky': isSticky } })} style={style}>
      <div {...classes('cell', 'source')}>
        Data sources
      </div>
      <div {...classes('cell', 'status')}>
        Status
      </div>
      <div {...classes('cell', 'execute')}>
        Execute
      </div>
      <div {...classes('cell', 'result')}>
        Result
      </div>
      <div {...classes('cell', 'publish')}>
        Publish
      </div>
    </div>
  );
}

function SubmissionGroup({ className, item, index, showCodeFileList }) {
  const classes = new BEMHelper('submissions-group');
  return (
    <div {...classes({ extra: className })}>
      <span {...classes('number')}>{index}</span>
      <Link {...classes('files')} onClick={showCodeFileList.bind(null, item)}>
        {item.queryFilesCount || '0'} file{item.queryFilesCount === 1 ? '' : 's'} submitted
      </Link>
      <ul {...classes('detail-list')}>
        {item.checksum &&
          <li {...classes('detail')}>
            Checksum {item.checksum.substr(0, 7)}
          </li>
        }
        <li {...classes('detail')}>
          {item.created}
        </li>
      </ul>
    </div>
  );
}

function SubmissionLine(props) {
  const classes = new BEMHelper('submission-line');
  const {
    submission,
    showCreateInsight,
    showResultFileList,
    onChangeExecutionStatus,
    onChangePublishStatus,
    showStatusHistory,
    showUploadForm,
    showRejectionModal,
    analysisId,
  } = props;

  return (
    <div {...classes()}>
      <div {...classes('cell', 'source')}>
        <LabelDataSource
          {...submission.dataSource}
        />
      </div>
      <div {...classes('cell', 'status')}>
        <CellStatus
          status={submission.status}
          showStatusHistory={() => showStatusHistory({
            submissionId: submission.id,
          })}
          comment={submission.status.comment}
        />
      </div>
      <div {...classes('cell', 'execute')}>
        <CellActions
          actionState={submission.actions[submissionActionTypes.EXECUTE]}
          doSubmit={() => onChangeExecutionStatus(submission.id, true)}
          doCancel={() => showRejectionModal(submission.id, submissionActionTypes.EXECUTE, analysisId)}
        />
      </div>
      <div {...classes('cell', 'result')}>
        <CellResults
          filesCount={submission.resultFilesCount}
          showList={showResultFileList.bind(null, submission)}
          canUploadResult={
            submission.actions[submissionActionTypes.MANUAL_UPLOAD].available
            && submission.actions[submissionActionTypes.MANUAL_UPLOAD].hasPermsission
          }
          showUploadForm={showUploadForm.bind(null, submission.id)}
        />
      </div>
      <div {...classes('cell', 'publish')}>
        <CellActions
          actionState={submission.actions[submissionActionTypes.PUBLISH]}
          doSubmit={() => onChangePublishStatus(submission.id, true)}
          doCancel={() => showRejectionModal(submission.id, submissionActionTypes.PUBLISH, analysisId)}
        />
      </div>
      <div {...classes('cell', 'insight')}>
        <CellInsight
          isDisabled={submission.actions[submissionActionTypes.PUBLISH].result !== true}
          hasInsight={submission.hasInsight}
          name={get(submission, 'insight.name')}
          showCreateInsight={showCreateInsight}
          submissionId={submission.id}
        />
      </div>
    </div>
  );
}

function ListSubmissions(props) {
  const classes = new BEMHelper('submissions');
  const {
    submissionGroupList,
    showCodeFileList,
    showCreateInsight,
    showResultFileList,
    onChangeExecutionStatus,
    onChangePublishStatus,
    showStatusHistory,
    showUploadForm,
    showRejectionModal,
    analysisId,
  } = props;

  const groupCount = submissionGroupList.length;
  const data = submissionGroupList.map((item, index) => {
    return (
      <div>
        <SubmissionGroup
          {...classes('group')}
          item={item}
          index={groupCount - index}
          showCodeFileList={showCodeFileList}
        />
        <div
          {...classes('list')}
        > 
        {item.submissions.map(submission =>
          <SubmissionLine
            submission={submission}
            showCreateInsight={showCreateInsight}
            showResultFileList={showResultFileList}
            onChangeExecutionStatus={onChangeExecutionStatus}
            onChangePublishStatus={onChangePublishStatus}
            showStatusHistory={showStatusHistory}
            showUploadForm={showUploadForm}
            showRejectionModal={showRejectionModal}
            analysisId={analysisId}
          />
        )}
        </div>
      </div>
    )
  });

  return (
    <div {...classes()}>
      {data.length ?
        <StickyContainer>
          <Sticky topOffset={-56}>
            { SubmissionsHeader }
          </Sticky>
          { data }
        </StickyContainer>
        :
        <div {...classes('empty')}>
          No queries were submitted yet...
        </div>
      }
    </div>
  );
}

export default ListSubmissions;
