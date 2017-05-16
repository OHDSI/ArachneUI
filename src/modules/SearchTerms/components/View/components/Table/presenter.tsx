import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  Link,
  TableCellText,
} from 'arachne-components';
import {} from 'redux-form';
import { paths } from 'modules/SearchTerms/const';

require('./style.scss');

interface ITermConnection {
  source: ITerm;
  target: ITerm;
};

interface ITerm {
  id: number;
  isCurrent: boolean;
  name: string;
};

interface ITermCell {
  header: string;
  field: string;
  value: ITerm;
};

interface ITermConnectionsTableStateProps {
  connections: Array<ITermConnection>;
};

interface ITermConnectionsTableDispatchProps {
};

interface ITermConnectionsTableProps extends ITermConnectionsTableStateProps, ITermConnectionsTableDispatchProps {
};

function TableCellTerm(term: any) {
  if (!term.value) {
    return null;
  }
  return (
    term.value.isCurrent
      ? <span>{term.value.name}</span>
      : <Link to={paths.term(term.value.id, true)}>{term.value.name}</Link>
  );
}

function TermConnectionsTable(props: ITermConnectionsTableProps) {
  const { connections } = props;
  const classes = BEMHelper('term-connections-table');

  return <div>
    <Table
        {...classes()}
        data={connections}
        mods={['hover', 'padded',]}
       >
          <TableCellText
            header='Relationship'
            field='relationshipName'
          />
          <TableCellTerm
            header='Relates to'
            field='targetConcept'
          />
          <TableCellText
            header='Vocabulary'
            field='targetVocabularyId'
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
