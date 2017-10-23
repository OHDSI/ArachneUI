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
 * Created: September 13, 2017
 *
 */

import React from 'react';
import { get } from 'services/Utils';
import { publishStateOptions } from 'modules/InsightsLibrary/const';
import { Link, TableCellText as Cell } from 'arachne-ui-components';
import TitleStudy from 'components/TitleStudy';
import BEMHelper from 'services/BemHelper';

function CellParticipants({ value }) {
  const classes = new BEMHelper('insight-list-participants-cell');

  if (!value || !value.length) {
    return <div>-</div>;
  }

  return (
    <ul {...classes()}>
      {value.map((participant, key) =>
        <Link {...classes('item')} to={participant.link} key={key}>
          {participant.label}
        </Link>
      )}
    </ul>
  )
}

function CellObjective({ value }) {
  const classes = new BEMHelper('cell-objective');

  let tooltip;
  if (value.length > 70) {
    tooltip = value;
    value = value.substring(0, 70) + '...';
  }
  return <div
    {...classes({extra: tooltip ? 'ac-tooltip' : null})}
    aria-label={tooltip}
    data-tootik-conf='multiline right'
  >{value}</div>;
}

function CellName(props) {
  const classes = new BEMHelper('insights-list-cell-title');
  return (
    <div {...classes()}>
      <TitleStudy {...props} />
    </div>
  );
}

export default class FieldsBuilder {
  constructor(props, bemHelper) {
    this.bemHelper = bemHelper;
    this.setFavourite = props.setFavourite;
  }

  getFields() {
    return {
      name: (
        <CellName
          {...this.bemHelper('name')}
          header="Study"
          field="study.title"
          props={paper => ({
            title: paper.study.title,
            isFavourite: paper.favourite,
            toggleFavorite: () => this.setFavourite(paper.id, (!paper.favourite).toString()),
            titleLabel: paper.publishState === 'DRAFT' ? 'DRAFT' : null,
            titleLabelDescr: get(publishStateOptions.filter(opt => opt.value === 'DRAFT')[0], 'tooltip'),
          })
          }
        />
      ),
      objective: (
        <CellObjective
          {...this.bemHelper('objective')}
          header="Objective"
          field="study.objective"
          isSortable={false}
        />
      ),
      lead: (
        <CellParticipants
          {...this.bemHelper('lead')}
          header="Lead"
          field="study.lead"
          isSortable={false}
        />
      ),
      proposal: (
        <Cell
          {...this.bemHelper('proposal')}
          header="Proposal"
          field="study.created"
        />
      ),
      launch: (
        <Cell
          {...this.bemHelper('launch')}
          header="Launch"
          field="study.startDate"
        />
      ),
      closure: (
        <Cell
          {...this.bemHelper('closure')}
          header="Closure"
          field="study.endDate"
        />
      ),
    };
  }

  build() {
    return Object.values(this.getFields());
  }
}
