import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import moment from 'moment';
import { usDateTime } from 'const/formats';
import { statusDictionary } from 'modules/Submissions/const';
import {
  Table,
  TableCellText as Cell,
  TableCellLink as CellLink,
  Button,
} from 'arachne-ui-components';

require('./style.scss');

class CellDownload extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(ev) {
    ev.preventDefault();
    const { id, downloadResults } = this.props;
    downloadResults(id, 'results.zip');
  }

  get isDisabled() {
    const { downloadingIds, id } = this.props;
    return downloadingIds.includes(id);
  }

  get isDownloadAvailable() {
    const { status } = this.props;
    return status.key === statusDictionary.EXECUTED.key;
  }

  render() {
    const classes = new BEMHelper('submission-download');

    return this.isDownloadAvailable ? (
      <Button
        {...classes('btn', 'download')}
        label={this.isDisabled ? 'Downloading' : 'Download'}
        mods={['submit', 'rounded']}
        disabled={this.isDisabled}
        onClick={this.handleClick}
      />
    ) : (<span>-</span>);
  }
}

function Status({ value }) {
  const classes = new BEMHelper('submission-status');
  return (
    <span {...classes({ modifiers: value.color })}>
      {value.label}
    </span>
  );
}

export default class SubmissionsTable extends Component {
  state = {
    tableClasses: new BEMHelper('submissions-table'),
  };

  formatCell(val) {
    return val ? val : '-';
  }

  formatDateCell(val) {
    return val ? moment(val).format(usDateTime) : '-';
  }

  getCellsList() {
    const { tableClasses } = this.state;
    const { downloadResults, downloadingIds } = this.props;
    return [
      <Cell
        key="id"
        {...tableClasses('id')}
        header="No"
        field="id"
        format={this.formatCell}
      />,
      <Cell
        key="author.fullName"
        {...tableClasses('author')}
        header="Author"
        field="author.fullName"
        format={this.formatCell}
      />,
      <Cell
        key="study"
        {...tableClasses('study')}
        header="Study"
        field="study"
        format={this.formatCell}
      />,
      <Cell
        key="analysis"
        {...tableClasses('analysis')}
        header="Analysis"
        field="analysis"
        format={this.formatCell}
      />,
      <Cell
        key="dataSource.name"
        {...tableClasses('data-source')}
        header="Data source"
        field="dataSource.name"
        format={this.formatCell}
      />,
      <Cell
        key="submitted"
        {...tableClasses('submitted')}
        header="Submitted"
        field="submitted"
        format={this.formatDateCell}
      />,
      <Cell
        key="finished"
        {...tableClasses('finished')}
        header="Finished"
        field="finished"
        format={this.formatDateCell}
      />,
      <Status
        key="status"
        {...tableClasses('status')}
        header="Status"
        field="status"
        format={this.formatCell}
      />,
      <CellDownload
        key="results"
        {...tableClasses('results')}
        header="Results"
        field="id"
        isSortable={false}
        props={
          entity => ({
            id: entity.id,
            status: entity.status,
            downloadResults,
            downloadingIds
          })
        }
      />,
    ];
  }

  render() {
    const { submissionList, sorting, setSort } = this.props;
    const { tableClasses } = this.state;
    return (
      <Table
        {...tableClasses()}
        mods={['hover', 'padded']}
        data={submissionList}
        sorting={sorting}
        setSorting={setSort}
      >
        {this.getCellsList()}
      </Table>
    );
  }
}

