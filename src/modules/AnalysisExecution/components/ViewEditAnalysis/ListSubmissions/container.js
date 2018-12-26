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
 * Created: December 13, 2016
 *
 */

import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths, submissionFilters, submissionStatuses, submissionGroupsPageSize } from 'modules/AnalysisExecution/const';
import { get } from 'services/Utils';
import isEmpty from 'lodash/isEmpty';
import actions from 'actions';
import Uri from 'urijs';
import { Utils } from 'services/Utils';
import ListSubmissions from './presenter';
import SelectorsBuilder from './selectors';
import { getFilter } from 'modules/AnalysisExecution/components/ViewEditAnalysis/container';

const selectors = (new SelectorsBuilder()).build();

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const isPaginationAvailable = true;
  const { number, totalPages } = selectors.getPagingData(state);
  const cleanPath = get(state, 'routing.locationBeforeTransitions.pathname');
  const currentQuery = state.routing.locationBeforeTransitions.query;
  const search = get(state, 'routing.locationBeforeTransitions.search');

  const url = new Uri(cleanPath);
  url.setSearch(currentQuery);

  const rawSelectedFilters = Utils.getFilterValues(get(state, 'routing.locationBeforeTransitions.search', '', 'String'));
  const selectedFilters = {};
  const datasources = get(state, 'studyManager.study.data.dataSources', [], 'Array');
  Object.entries(rawSelectedFilters)
    .forEach(([filterId, filter]) => {
      switch (filterId) {
        case submissionFilters.hasInsight.name:
          selectedFilters[filterId] = [filter ? 'Only with insights' : ''];
          break;
        case submissionFilters.submissionStatuses.name:
          selectedFilters[filterId] = filter.map((f) => {
            const status = submissionStatuses.find(s => s.value === f);
            return status.label;
          });
          break;
        case submissionFilters.dataSourceIds.name:
          selectedFilters[filterId] = filter.map((f) => {
            const datasource = datasources.find(ds => ds.id === parseInt(f, 10));
            if (datasource) {
              return `${datasource.dataNode.name}: ${datasource.name}`;
            }
          });
          break;
      }
    });
  const page = number + 1;
  const submissionGroupList = selectors.getSubmissionGroupList(state);
  const pageSize = get(state, 'analysisExecution.submissionGroups.queryResult.size', 0);
  const groupCount = get(state, 'analysisExecution.submissionGroups.queryResult.totalElements', submissionGroupList.length) - (number * pageSize);

  return {
    analysisId: get(analysisData, 'id'),
    submissionGroupList,
    isPaginationAvailable,
    totalPages,
    page,
    path: url.href(),
    isFiltered: !isEmpty(selectedFilters),
    selectedFilters: Object.entries(selectedFilters),
    filter: getFilter(search),
    groupCount,
  };
}

const mapDispatchToProps = {
  showFileList: data => ModalUtils.actions.toggle(modal.analysisFiles, true, data),
  loadAnalysis: actions.analysisExecution.analysis.find,
  changeExecutionStatus: actions.analysisExecution.executionStatus.create,
  changePublishStatus: actions.analysisExecution.publishStatus.create,
  showStatusHistory: ({ submissionId }) =>
    ModalUtils.actions.toggle(modal.statusHistory, true, { submissionId }),
  showUploadForm: submissionId =>
    ModalUtils.actions.toggle(modal.uploadResult, true, { submissionId }),
  showCreateInsight: submissionId =>
    ModalUtils.actions.toggle(modal.createInsight, true, { submissionId }),
  showRejectionModal: (submissionId, type, analysisId) =>
    ModalUtils.actions.toggle(modal.rejectSubmission, true, { submissionId, type, analysisId }),
  showResults: ({ submissionId }) =>
    actions.router.goToPage(paths.submissionResultSummary({ submissionId })),
  showFilters: () => ModalUtils.actions.toggle(modal.submissionsTableFilter, true),
  update: actions.analysisExecution.submission.update,
  loadSubmissionGroups: ({ page = 1, analysisId, filter }) => {
    const pageSize = submissionGroupsPageSize;
    return actions.analysisExecution.submissionGroups.query({ page, pageSize, analysisId, filter });
  },
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    showCodeFileList({ id, queryFilesCount }) {
      dispatchProps.showFileList({
        type: 'code',
        submissionGroupId: id,
        canRemoveFiles: false,
        queryFilesCount,
      });
    },
    showResultFileList(submission) {
      dispatchProps.showResults({
        submissionId: submission.id,
      });
    },
    async onChangeExecutionStatus(submissionId, status) {
      await dispatchProps.changeExecutionStatus({ submissionId }, { id: submissionId, isApproved: status });
      dispatchProps.loadSubmissionGroups({
        analysisId: stateProps.analysisId,
        page: stateProps.page,
        filter: stateProps.filter,
      });
    },
    async onChangePublishStatus(submissionId, status) {
      await dispatchProps.changePublishStatus({ submissionId }, { id: submissionId, isApproved: status });
      dispatchProps.loadSubmissionGroups({
        analysisId: stateProps.analysisId,
        page: stateProps.page,
        filter: stateProps.filter,
      });
    },
    async toggleVisibility(hidden, submission) {
      await dispatchProps.update({ id: submission.id }, { ...submission, hidden });
      dispatchProps.loadSubmissionGroups({
        analysisId: stateProps.analysisId,
        page: stateProps.page,
        filter: stateProps.filter,
      });
    },
  };
}

ListSubmissions.propTypes = {
  analysisId: PropTypes.number,
  loadAnalysis: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ListSubmissions);
