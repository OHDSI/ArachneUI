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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-ui-components';
import Checklist from '../Checklist';

require('./style.scss');

function StudyActions(props) {
  const classes = new BEMHelper('study-actions');
  const tooltipClass = new BEMHelper('tooltip');
  const {
    canCreatePaper,
    isEditable,
    isFilledForPaper,
    goToPaper,
    publishPaper,
    publishedPaperId,
    reload,
    canDelete,
    remove,
  } = props;

  let publishContent;
  if (publishedPaperId) {
    publishContent = (
      <span
        {...tooltipClass()}
        aria-label="Go to published paper"
        data-tootik-conf="left"
      >
        <Button {...classes('publish')}>
          <i {...classes('publish-ico')} onClick={goToPaper}>
            description
          </i>
          <i {...classes('publish-ico-marker')} />
        </Button>
      </span>
    );
  } else if (isEditable && canCreatePaper && isFilledForPaper) {
    publishContent = (
      <span
        {...tooltipClass()}
        aria-label="Publish a paper based on the study"
        data-tootik-conf="left"
      >
        <Button {...classes('publish')}>
          <i {...classes('publish-ico')} onClick={publishPaper}>
            description
          </i>
        </Button>
      </span>
    );
  } else if (isEditable && canCreatePaper) {
    publishContent = (
      <span
        {...classes({ element: 'publish-tooltip', extra: tooltipClass().className })}
        aria-label="Complete following fields to publish a paper: title, description, start date and end date"
        data-tootik-conf="left"
      >
        <Button
          {...classes('publish')}
          disabled={true}
        >
          <i {...classes('publish-ico', 'grey')}>
            description
          </i>
        </Button>
      </span>
    );
  }
  
  return (
    <ul {...classes()}>
      <li {...classes('item')}>
        <Checklist />
      </li>
      <li {...classes('item')}>
        {publishContent}
        <Button {...classes('reload')} onClick={reload}>
          <i {...classes('reload-ico')}>refresh</i>
        </Button>
        {canDelete &&
          <Button {...classes('remove')} onClick={remove}>
            <i {...classes('remove-ico')}>delete</i>
          </Button>
        }
      </li>
    </ul>
  );
}

StudyActions.propTypes = {
  canCreatePaper: PropTypes.bool,
  isEditable: PropTypes.bool,
  isFilledForPaper: PropTypes.bool,
  goToPaper: PropTypes.func,
  publishPaper: PropTypes.func,
  publishedPaperId: PropTypes.number,
  reload: PropTypes.func,
  canDelete: PropTypes.bool,
  remove: PropTypes.func,
};

export default StudyActions;
