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
 * Created: June 13, 2017
 *
 */

import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-ui-components';
let CodeMirror = null;
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    CodeMirror = require('react-codemirror');
    require('codemirror/mode/r/r');
    require('codemirror/mode/sql/sql');
}

require('./style.scss');

function CodeBar(props = {}) {
  const classes = new BEMHelper('code-codebar');

  const {
    btnList = [],
    downloadLink,
    infoList = [],
    title,
  } = props;

  return (
    <div {...classes()}>
      <div {...classes('info')}>
        {infoList}
      </div>
      <div {...classes('actions')}>
        <Button
          {...classes('btn', 'download')}
          label="Download"
          mods={['submit', 'rounded']}
          link={downloadLink}
          target="_self"
        />    
      </div>
      {btnList.length > 0 &&
        <div {...classes('actions', 'custom')}>
          {btnList}
        </div>
      }
    </div>
  );
}

CodeBar.propTypes = {
  downloadLink: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function CodeEditor(props) {
  const classes = new BEMHelper('code-editor');
  const {
    barBtnList,
    downloadLink,
    isEditable,
    infoList,
    language,
    title,
    // 
    onChange,
    value,
  } = props;

  const codeMirrorOptions = {
    lineNumbers: true,
    mode: language,
    readOnly: !isEditable,
  };

  return (
    <div {...classes()}>
      <div {...classes('bar')}>
        <CodeBar
          title={title}
          infoList={infoList}
          downloadLink={downloadLink}
          btnList={barBtnList}
        />
      </div>
      { CodeMirror && <div {...classes('edit')}>
        <CodeMirror
          onChange={onChange}
          options={codeMirrorOptions}
          value={value}
        />
      </div>}
    </div>
  );
}

CodeEditor.propTypes = {
  downloadLink: PropTypes.string.isRequired,
  language: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default CodeEditor;
