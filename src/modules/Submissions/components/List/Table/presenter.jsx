import React from 'react';
import BEMHelper from 'services/BemHelper';
import moment from 'moment';
import { usDateTime } from 'const/formats';
import { links, statusDictionary } from 'modules/Submissions/const';
import {
  Table,
  TableCellText as Cell,
  TableCellLink as CellLink,
  Button,
} from 'arachne-ui-components';

require('./style.scss');

function CellDownload({ id, status }) {
  const classes = new BEMHelper('submission-download');

  if (status.key !== statusDictionary.EXECUTED.key) {
    return <span>-</span>;
  }

  return (
    <Button
      {...classes('btn', 'download')}
      label="Download"
      mods={['submit', 'rounded']}
      link={links.downloadResults(id)}
      target="_self"
    />
  );
}

function Status({ value }) {
  const classes = new BEMHelper('submission-status');
  return (
    <span {...classes({ modifiers: value.color })}>
      {value.label}
    </span>
  );
}

function formatCell(val) {
  return val ? val : '-';
}

function formatDateCell(val) {
  return val ? moment(val).format(usDateTime) : '-';
}

function SubmissionsTable(props) {
  const tableClasses = new BEMHelper('submissions-table');
  const { submissionList, sorting, setSort } = props;

  return (
    <Table
      {...tableClasses()}
      mods={['hover', 'padded']}
      data={submissionList}
      sorting={sorting}
      setSorting={setSort}
    >
      <Cell
        {...tableClasses('id')}
        header="No"
        field="id"
        format={formatCell}
      />
      <Cell
        {...tableClasses('origin')}
        header="Origin"
        field="origin"
        format={formatCell}
      />
      <Cell
        {...tableClasses('author')}
        header="Author"
        field="author.fullName"
        format={formatCell}
      />
      <Cell
        {...tableClasses('study')}
        header="Study"
        field="study"
        format={formatCell}
      />
      <Cell
        {...tableClasses('analysis')}
        header="Analysis"
        field="analysis"
        format={formatCell}
      />
      <Cell
        {...tableClasses('data-source')}
        header="Data source"
        field="dataSource.name"
        format={formatCell}
      />
      <Cell
        {...tableClasses('submitted')}
        header="Submitted"
        field="submitted"
        format={formatDateCell}
      />
      <Cell
        {...tableClasses('finished')}
        header="Finished"
        field="finished"
        format={formatDateCell}
      />
      <Status
        {...tableClasses('status')}
        header="Status"
        field="status"
        format={formatCell}
      />
      <CellDownload
        {...tableClasses('results')}
        header="Results"
        field="id"
        isSortable={false}
        props={
          entity => ({
            id: entity.id,
            status: entity.status,
          })
        }
      />
    </Table>
  );
}

export default SubmissionsTable;
