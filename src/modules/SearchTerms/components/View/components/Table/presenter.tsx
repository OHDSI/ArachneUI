/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *  
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  Link,
  TableCellText,
} from 'arachne-ui-components';
import { paths } from 'modules/SearchTerms/const';

require('./style.scss');

interface ITermConnection {
  source: ITerm;
  target: ITerm;
};

interface ITerm {
  targetConceptId: number;
  targetConceptName: string;
  targetVocabularyId: number;
};

interface ITermCell {
  header: string;
  field: string;
  value: Array<ITerm>;
};

interface ITermConnectionsTableStateProps {
  connections: Array<ITermConnection>;
};

interface ITermConnectionsTableDispatchProps {
};

interface ITermConnectionsTableProps extends ITermConnectionsTableStateProps, ITermConnectionsTableDispatchProps {
};

function TableCellTerm(term: any) {
  const classes = BEMHelper('term-connections-table');
  if (!term.value.id) {
    return null;
  }
  return (
    <div {...classes('target-cell')}>
      <Link to={paths.term(term.value.id, false)}>{term.value.name}</Link>
    </div>
  );
}

function TableCellVoc(term: any) {
  const classes = BEMHelper('term-connections-table');
  if (!term.value) {
    return null;
  }
  return (
    <div {...classes('vocabulary-cell')}>
      {term.value}
    </div>
  );
}

function TableCellConceptId(term: any) {
  const classes = BEMHelper('term-connections-table');
  if (!term.value.id) {
    return null;
  }
  return (
    <div {...classes('target-cell')}>
      <span>{term.value.id}</span>
    </div>
  );
}

function TableCellRelation(term: any) {
  const classes = BEMHelper('term-connections-table');
  return (
    <div {...classes({ element: 'relation-cell', modifiers: { empty: !term.value } })}>
      {term.value}
    </div>
  );
}

function TermConnectionsTable(props: ITermConnectionsTableProps) {
  const { connections } = props;
  const classes = BEMHelper('term-connections-table');

  return <div
      {...classes()}>
    <Table
      data={connections}
      mods={['hover', 'padded',]}
     >
        <TableCellRelation
          header='Relationship'
          field='relationshipName'
        />
        <TableCellTerm
          header='Relates to'
          field='targetConcept'
        />
        <TableCellConceptId
          header='Concept id'
          field='targetConcept'
        />
        <TableCellVoc
          header='Vocabulary'
          field='targetConceptVoc'
        />
    </Table>
  </div>;
}

export default TermConnectionsTable;
export {
  ITermConnectionsTableStateProps,
  ITermConnectionsTableDispatchProps,
  ITermConnectionsTableProps,
  ITerm,
  ITermConnection,
};
