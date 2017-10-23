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
 * Created: May 29, 2017
 *
 */

import { Component, PropTypes } from 'react';
import actions from 'actions/index';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { reports, reportFilenames, paths } from 'modules/DataCatalog/const';
import { push as goToPage } from 'react-router-redux';
import presenter from './presenter';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReport: 'dashboard',
    };
    this.selectReport = this.selectReport.bind(this);
  }

  componentWillMount() {
    if (this.props.characterization) {
      this.loadReport(this.props.characterization, this.state.selectedReport);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.characterization.length !== nextProps.characterization.length) {
      this.loadReport(nextProps.characterization, this.state.selectedReport);
    }
  }
  loadReport(characterization, report) {
    let filePath = characterization.filter(
        file => reportFilenames[report].test(file.filePath)
    );
    let filename = 'empty';
    let path = null;
    this.props.clearReportDetails();
    if (filePath.length) {
      filePath = filePath[0].filePath.split('\\');
      if (filePath[1]) {
        path = filePath[0];
        filename = filePath[1];
      } else {
        filename = filePath[0];
      }
      this.props.loadReport({
        id: this.props.dataSourceId,
        filename,
        path,
      });
    } else {
      this.props.clearReportData();
    }
  }

  selectReport(report) {
    this.props.resetPage();
    this.setState({
      selectedReport: report,
    });
    this.loadReport(this.props.characterization, report);
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      selectReport: this.selectReport,
    });
  }
}

Report.propTypes = {
  characterization: PropTypes.arrayOf(PropTypes.string),
  clearReportData: PropTypes.func,
  clearReportDetails: PropTypes.func,
  dataSourceId: PropTypes.string,
  resetPage: PropTypes.func,
  loadReport: PropTypes.func,

};

function mapStateToProps(state, ownProps) {
  const list = get(state, 'dataCatalog.report.queryResult.result', []) || [];
  const characterization = get(state, 'dataCatalog.characterization.data.result.files', []) || [];
  const isLoading = get(state, 'dataCatalog.characterization.isLoading', false)
        || get(state, 'dataCatalog.report.isLoading', false)
        || get(state, 'dataCatalog.reportDetails.isLoading', false);

  return {
    characterization,
    dataSourceId: ownProps.dataSourceId,
    list,
    isLoading,
    initialValues: {
      report: reports.DASHBOARD,
    },
  };
}

const mapDispatchToProps = {
  loadReport: actions.dataCatalog.report.find,
  clearReportData: actions.dataCatalog.report.clear,
  clearReportDetails: actions.dataCatalog.reportDetails.clear,
  redirect: address => goToPage(address),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    resetPage: () => dispatchProps.redirect(`${paths.dataCatalog(stateProps.dataSourceId)}/profile`),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Report);
