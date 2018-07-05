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
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { Button, Link } from 'arachne-ui-components';
import CodeEditor from 'components/CodeEditor';
import moment from 'moment-timezone';
import { usDateTime as dateFormat } from 'const/formats';

require('./style.scss');

function getCodeInfoList({
  author,
  createdAt,
  updatedAt,
  updatedBy,
  version,
}) {
  const classes = new BEMHelper('analysis-code-details');
  const infoPartList = [];

  if (author && !updatedBy) {
    let part = (
      <span {...classes('created')}>
        Created by <Link to={author.link}>{author.name}</Link> at {moment(createdAt).tz(moment.tz.guess()).format(dateFormat)}
      </span>
    );
    infoPartList.push(part);
  }

  if (updatedBy) {
    let part = (
      <span {...classes('updated')}>
        Updated by <Link to={updatedBy.link}>{updatedBy.name}</Link> at {moment(updatedAt).tz(moment.tz.guess()).format(dateFormat)}
      </span>
    );
    infoPartList.push(part);
  }

  if (version) {
    let part = (
      <span {...classes('version')}>
        V{version}
      </span>
    );
    infoPartList.push(part);    
  }

  return (
    <div {...classes()}>{infoPartList}</div>
  );
}

function getCodeBarBtns(props) {
  const classes = new BEMHelper('analysis-code-codebar');
  const tooltipClass = new BEMHelper('tooltip');

  const {
    revertAnalysisCode,
    canLockCode,
    isCodeLocked,
    unlockCode,
  } = props;

  let btnList = [];
  if (isCodeLocked) {
    if (canLockCode) {
      btnList = [(
        <Button
          {...classes('btn', 'unlock')}
          label="Unlock"
          mods={['success', 'rounded']}
          onClick={unlockCode}
        />
      )];
    } else {
      btnList = [(
        <span
          {...tooltipClass({ extra: classes('request-unlock-tooltip').className })}
          aria-label="Lead Investigator locked edit capabilities for code files in this analysis"
          data-tootik-conf="left"
        >
          <Button
            {...classes('btn', 'request-unlock')}
            mods={['success', 'rounded']}
            label="Request unlock"
            onClick={unlockCode}
          />
        </span>
      )];
    }
  } else {
    btnList = [
      <Button
        label="Save"
        mods={['success', 'rounded']}
        type="submit"
        {...classes('btn', 'save')}
      />,
      <Button
        label="Close"
        mods={['cancel', 'rounded']}
        onClick={revertAnalysisCode}
        {...classes('btn', 'delete')}
      />
    ];
  }

  return btnList;
}

function FormCodeEditor(props) {
  const {
    input,
    params,
  } = props;

  return (
    <CodeEditor
      {...params}
      onChange={input.onChange}
      value={input.value}
    />
  )
}

function AnalysisCodeEditor(props) {
  const classes = new BEMHelper('analysis-code-editor');
  const {
    canLockCode,
    downloadLink,
    isCodeLocked,
    language,
    revertAnalysisCode,
    doSubmit,
    title,
    unlockCode,
    // code metadata
    author,
    createdAt,
    updatedAt,
    updatedBy,
    version,
    // redux-form props
    handleSubmit,
  } = props;

  const codeBarBtnList = getCodeBarBtns({
    canLockCode,
    isCodeLocked,
    revertAnalysisCode,
    title,
    unlockCode,
  });

  const codeInfo = getCodeInfoList({
    author,
    createdAt,
    updatedAt,
    updatedBy,
    version,
  });

  return (
    <form {...classes()} onSubmit={handleSubmit(doSubmit)}>
      <Field
        component={FormCodeEditor}
        name="content"
        params={{
          barBtnList: codeBarBtnList,
          infoList: codeInfo,
          downloadLink: downloadLink,
          isEditable: !isCodeLocked,
          language: language,
          title: title,
        }}
      />
    </form>
  );
}

AnalysisCodeEditor.propTypes = {
  doSubmit: PropTypes.func.isRequired,
  downloadLink: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  language: PropTypes.string,
  revertAnalysisCode: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default AnalysisCodeEditor;
