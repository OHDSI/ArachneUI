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
 * Created: July 10, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import PreventOutsideScroll from 'react-prevent-outside-scroll';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { Button, Panel, LoadingPanel } from 'arachne-ui-components';
import ProgressBar from 'components/ProgressBar';

require('./style.scss');

function Step({ title, descr, isDone, onClick }) {
  const classes = new BEMHelper('study-checklist-step');

  return (
    <div
      {...classes({ modifiers: { done: isDone } })}
      onClick={onClick}
    >
      <div {...classes('status')}>
        <i {...classes('status-ico')}>
          done
        </i>
      </div>
      <div {...classes('info')}>
        <label {...classes('title')}>
          {title}
        </label>
        <span {...classes('descr')}>
          {descr}
        </span>
      </div>
    </div>
  );
}

function Checklist(props) {
  const classes = new BEMHelper('study-checklist');
  const tooltipClasses = new BEMHelper('tooltip');
  const {
    closeDropdown,
    percent,
    stepList,
    startGuide,
    showGuideStep
  } = props;

  return (
    <Dropdown {...classes()} ref="dropdown">
      <DropdownTrigger>
        <div
          {...classes({
            element: 'toggle',
            extra: tooltipClasses().className
          })}
          aria-label="Click to open Study workflow checklist"
          data-tootik-conf="top"
        >
          <ProgressBar percent={percent} />
        </div>
      </DropdownTrigger>
      <DropdownContent>
        <Panel
          {...classes('content')}
          title="Study workflow checklist"
          mods="black-header">
          <PreventOutsideScroll>
            <div
              {...classes('step-list')}
            >
              {stepList.map((step, key) => 
                <Step
                  {...step}
                  key={key}
                  onClick={() => {
                    closeDropdown();
                    showGuideStep(key);
                  }}
                />
              )}
            </div>
          </PreventOutsideScroll>
          <div {...classes('toolbar')}>
            <div {...classes('done-count')}>
              Done {stepList.filter(s => s.isDone).length} / {stepList.length}
            </div>
            <Button
              {...classes('guide-btn')}
              mods={['success']}
              label="Guide me"
              onClick={() => {
                closeDropdown();
                startGuide();
              }}
            />
          </div>
        </Panel>
      </DropdownContent>
    </Dropdown>
  );
}

export default Checklist;
