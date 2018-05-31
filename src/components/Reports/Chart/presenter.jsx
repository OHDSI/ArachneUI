/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Authors: Alexander Saltykov
 * Created: November 21, 2017
 *
 */

import React from 'react';
import {
  Panel,
  Button,
  TabbedPane,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

import './style.scss';

function Chart(props) {
  const {
    children,
    setContainer,
    downloadAsPng,
    title,
    className,
    isDataPresent = true,
    isTreemap = false,
    table = null,
  } = props;
  const emptyClasses = BEMHelper('report-empty');
  const classes = BEMHelper('chart');
  const headerBtns = <Button onClick={downloadAsPng}>
    <span {...classes('download-btn')}>file_download</span>
  </Button>;

  const sections = [
    {
      label: 'Treemap',
      content: <div
        className={isDataPresent ? '' : emptyClasses().className}
        ref={(el) => { setContainer(el); }}
      >
        {!isDataPresent && <span {...emptyClasses('text')}>No data</span>}
      </div>,
    },
    {
      label: 'Table',
      content: table,
    },
  ];

  return (
    <Panel
      title={title}
      {...classes({ extra: className })}
      headerBtns={() => isDataPresent ? headerBtns : null}
    >
      {isTreemap
        ? <TabbedPane sections={sections} />
        : sections[0].content
      }
    </Panel>
  );
}

Chart.propTypes = {
};

export default Chart;
