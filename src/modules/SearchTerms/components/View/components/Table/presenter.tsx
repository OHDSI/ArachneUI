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
