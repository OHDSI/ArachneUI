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
 * Created: August 30, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function StudyStatus(props) {
  const  {
    color,
    label,
    disabled,
    selected,
    tooltipText,
    tooltipConf,
    isOption,
  } = props;

  const classes = new BEMHelper('study-status-option');
  const isDisabled = disabled && isOption;

  return (
    <span {...classes({ modifiers: { disabled, selected, 'is-option': isOption }, extra: isDisabled ? 'ac-tooltip' : '' })}
      aria-label={tooltipText}
      data-tootik-conf={tooltipConf}
      onClick={isDisabled ? (event) => { event.stopPropagation(); } : event => event}
    >
      <i {...classes('status-ico', color)} />
      <span {...classes('label')}>
        {label}
      </span>
    </span>
  );
}

StudyStatus.propTypes = {
  downloadLink: PropTypes.string.isRequired,
  language: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default StudyStatus;
