import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  Link,
  TableCellText,
  LoadingPanel
} from 'arachne-components';
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
  isLoading: boolean;
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
      <Link to={paths.term(term.value.id, true)}>{term.value.name}</Link>
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

function TableCellRelation(term: any) {
  const classes = BEMHelper('term-connections-table');
  return (
    <div {...classes({ element: 'relation-cell', modifiers: { empty: !term.value } })}>
      {term.value}
    </div>
  );
}

function TermConnectionsTable(props: ITermConnectionsTableProps) {
  const { connections, isLoading } = props;
  const classes = BEMHelper('term-connections-table');

  return <div>
    <Table
      {...classes()}
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
        <TableCellVoc
          header='Vocabulary'
          field='targetConceptVoc'
        />
    </Table>
    <LoadingPanel active={isLoading} />
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
