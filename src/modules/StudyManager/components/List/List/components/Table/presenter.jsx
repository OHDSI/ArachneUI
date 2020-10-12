/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: August 30, 2017
 *
 */

import React, { PropTypes, Component } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Link,
  Table,
  TableCellText as Cell,
  TableCellStatus as CellStatus,
} from 'arachne-ui-components';
import TitleStudy from 'components/TitleStudy';

require('./style.scss');

function LeadList({ userLinkFormatter, value }) {
  return (
    <div onClick={(e) => { e.stopPropagation(); }}>
      {value.map(userLinkFormatter).map((lead, key) => 
        <span key={key}>
          {key > 0 ? ', ' : ''}
          <Link to={lead.link}>{lead.label}</Link>
        </span>
      )}
    </div>
  );
}

function CellName(props) {
  const classes = new BEMHelper('cell-name');
  return (
    <div {...classes()}>
      <TitleStudy
        {...props}
      />
    </div>
  );
}

class TableStudies extends Component {
  constructor() {
    super();
    this.tableClasses = new BEMHelper('studies-table');
  }

  getColumns() {
    return [
      <CellName
        {...this.tableClasses('study')}
        header="Study"
        field="title"
        mods={['bold']}
        props={study => ({
          ...study,
          isFavourite: study.favourite,
          title: study.title,
          toggleFavorite: () => this.props.setFavourite(
            study.id,
            (!study.favourite).toString()
            ),
        })}
      />,
      <LeadList
        {...this.tableClasses('lead')}
        header="Lead"
        field="leadList"
        userLinkFormatter={this.props.userLinkFormatter}
      />,
      <Cell
        {...this.tableClasses('role')}
        header="My role"
        field="role"
      />,
      <Cell
        {...this.tableClasses('created')}
        header="Created"
        field="created"
        format={this.props.timestampFormatter}
      />,
      <Cell
        {...this.tableClasses('created')}
        header="Updated"
        field="updated"
        format={this.props.timestampFormatter}
      />,
      <Cell
        {...this.tableClasses('type')}
        header="Type"
        field="type"
        format={this.props.typeFormatter}
      />,
      <CellStatus
        {...this.tableClasses('status')}
        header="Status"
        field="status"
        format={this.props.statusFormatter}
      />
    ];
  }

  render () {
    const {
      data,
      sorting,
      setSorting,
      goToStudy,
    } = this.props;

    return (
      <div {...this.tableClasses()}>
        <Table
          {...this.tableClasses('table')}
          mods={['hover', 'selectable', 'padded']}
          data={data}
          sorting={sorting}
          setSorting={setSorting}
          onRowClick={({ id }) => goToStudy(id)}
        >
          {this.getColumns()}
        </Table>
      </div>
    );
  }
}

TableStudies.propTypes = {
  timestampFormatter: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  goToStudy: PropTypes.func.isRequired,
  userLinkFormatter: PropTypes.func.isRequired,
  setSorting: PropTypes.func.isRequired,
  sorting: PropTypes.object.isRequired,
  statusFormatter: PropTypes.func.isRequired,
  typeFormatter: PropTypes.func.isRequired,
  pages: PropTypes.number,
  path: PropTypes.string,
};

export default TableStudies;
