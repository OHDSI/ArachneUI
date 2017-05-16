import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  Link,
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
  goToTerm: (id: number) => any;
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
          <TableCellTerm
            header='Concept'
            field='source'
          />
          <TableCellTerm
            header='Relates to'
            field='target'
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
