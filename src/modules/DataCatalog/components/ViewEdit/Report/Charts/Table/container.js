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
 * Created: June 13, 2017
 *
 */

import debounce from 'lodash/debounce';
import Fuse from 'fuse.js';
import get from 'lodash/get';
import { Component, PropTypes } from 'react';
import sortBy from 'lodash/sortBy';
import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';
import presenter from './presenter';

class Table extends Component {
  constructor() {
    super();
    this.state = {
      sorting: null,
      searchString: '',
      columns: null,
    };
    this.setSorting = this.setSorting.bind(this);
    this.setSearch = debounce(this.setSearch.bind(this), 300);
    this.setColumns = this.setColumns.bind(this);
  }

  setSorting(newSorting) {
    this.setState({
      sorting: newSorting,
    });
  }
  setColumns(list) {
    this.updateSearch(list);
    // iterate through all columns to respect their order
    this.setState({
      columns: Object.keys(this.props.columns)
        .filter(col => list.includes(col)),
    });
  }

  setSearch(searchString) {
    const columns = this.state.columns || Object.keys(this.props.columns);
    this.updateSearch(columns);
    this.setState({
      searchString,
    });
  }

  updateSearch(columns) {
    this.fuseSearch = new Fuse(this.props.data, {
      keys: columns.map(col => `${col}.value`),
      threshold: 0.25,
    });
    this.props.setPage(1);
  }

  render() {
    const selectedColumns = this.state.columns || Object.keys(this.props.columns);
    const sorting = this.state.sorting || {
      sortBy: selectedColumns[0],
      sortAsc: true,
    };
    let data = this.props.data;
    if (this.state.searchString) {
      data = this.fuseSearch.search(this.state.searchString);
    }
    data = sortBy(data, `${sorting.sortBy}.value`);
    if (!sorting.sortAsc) {
      data = data.reverse();
    }
    const page = data.slice(
      (this.props.currentPage - 1) * this.props.pageSize,
      this.props.currentPage * this.props.pageSize
    );
    return presenter({
      ...this.props,
      currentPage: this.props.currentPage,
      columns: this.props.columns,
      data: page,
      setColumns: this.setColumns,
      setSearch: this.setSearch,
      setSorting: this.setSorting,
      selectedColumns,
      sorting,
      pages: Math.ceil(data.length / this.props.pageSize),
      totalItems: data.length,
    });
  }
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  data: PropTypes.arrayOf({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  setPage: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const path = get(state, 'routing.locationBeforeTransitions', {
    pathname: '',
    search: '',
  });
  const pageSize = ownProps.pageSize || 10;
  const currentPage = parseInt(get(state, 'routing.locationBeforeTransitions.query.page', 1), 0);

  return {
    currentPage,
    pageSize,
    path: path.pathname + path.search,
  };
}

const mapDispatchToProps = {
  goTo: path => goToPage(path),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setPage: (pageNum) => {
      const url = new URI(stateProps.path);
      url.setSearch('page', pageNum);
      dispatchProps.goTo(url.href());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table);
