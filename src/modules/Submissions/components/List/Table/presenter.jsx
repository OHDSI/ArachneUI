import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import moment from 'moment';
import { usDateTime } from 'const/formats';
import { links, statusDictionary, paths } from 'modules/Submissions/const';
import { Table, TableCellText as Cell, Link, Button } from 'arachne-ui-components';

require('./style.scss');

const CellDownload = ({ id, status }) => {
  const url = links.downloadResults(id);

  const classesExplorer = new BEMHelper('submission-explore');
  const classesDownload = new BEMHelper('submission-download');
  const tooltip = new BEMHelper('tooltip');
  return (
    status.key === statusDictionary.EXECUTED.key ? (
      <div>
        <div {...tooltip()} aria-label="Explorer" >
          <Link to={paths.detailsExplorer(id)}>
            <Button
              {...classesExplorer()}
              mods={['submit', 'rounded']}>
              remove_red_eye
            </Button>
          </Link>
        </div>
        <div {...tooltip()} aria-label="Download" >
          <Button
            {...classesDownload()}
            mods={['success', 'rounded', 'ac-tooltip']}
            link={url}

            target="_self" >
            file_download
          </Button>
        </div>
      </div>) : (<span>-</span>)
  );
};

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
      // <Cell
      //   key="study"
      //   {...tableClasses('study')}
      //   header="Study"
      //   field="study"
      //   format={this.formatCell}
      // />,
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
      <Cell
        key="environment"
        {...tableClasses('data-source')}
        header="Environment"
        field="environment"
        format={this.formatCell}
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

