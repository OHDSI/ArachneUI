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
 * Created: June 13, 2017
 *
 */

import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-ui-components';
import CodeEditor from 'components/CodeEditor';
import moment from 'moment-timezone';
import { usDateTime as dateFormat } from 'const/formats';

require('./style.scss');

function Viewer(props) {
  const classes = new BEMHelper('submission-code-viewer');
  const {
    createdAt,
    downloadLink,
    language,
    title,
    unlockCode,
    value,
  } = props;

  const codeMirrorOptions = {
    lineNumbers: true,
    mode: language,
  };

  return (
    <CodeEditor
      barBtnList={[]}
      infoList={[
        <span {...classes('created')}>
          Created at {moment(createdAt).tz(moment.tz.guess()).format(dateFormat)}
        </span>
      ]}
      downloadLink={downloadLink}
      isEditable={false}
      language={language}
      title={title}
      value={value}
    />
  );
}

Viewer.propTypes = {
  downloadLink: PropTypes.string.isRequired,
  language: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Viewer;
