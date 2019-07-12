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
 * Created: December 20, 2016
 *
 */

import { connect } from 'react-redux';

import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Submissions/const';
import Actions from './presenter';
import { Utils } from 'services/Utils';


function mapStateToProps(state) {
  return {
    currentQuery: state.routing.locationBeforeTransitions.query,
  };
}

const mapDispatchToProps = {
  openCreateSubmissionModal: () => ModalUtils.actions.toggle(modal.createSubmission, true),
  loadSubmissionList: actions.submissions.submissionList.query,
  invalidateAnalyses: actions.submissions.invalidateAnalyses.create,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    invalidateAndRefresh: () => {
      Utils
        .confirmDelete({message: "Do you really want to invalidate all unfinished submissions?"})
        .then(() => {
          dispatchProps
            .invalidateAnalyses()
        .then(dispatchProps.loadSubmissionList({query: null}))
        .catch(() => {})
       });
    },
    // reloadList() {
    //   dispatchProps.loadList({}, { query: stateProps.currentQuery });
    // },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Actions);
