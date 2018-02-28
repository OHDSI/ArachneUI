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
  * Created: Monday, February 26, 2018 4:17 PM
  *
  */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import { reset } from 'redux-form';
import { ContainerBuilder, get } from 'services/Utils';
import { form, modal, submissionStatuses, paths } from 'modules/AnalysisExecution/const';
import { ModalUtils } from 'arachne-ui-components';
import URI from 'urijs';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class SubmissionsTableFilter extends Component {
  static get propTypes() {
    return {
    };
  } 

  render() {
    return presenter(this.props);
  }
}
 
export default class SubmissionsTableFilterBuilder extends ContainerBuilder {
  getComponent() {
    return SubmissionsTableFilter;
  }

  
  getFormParams() {
    return {
      form: form.submissionsTableFilter,
      enableReinitialize: false,
    };
  }
  
  getModalParams() {
    return {
      name: modal.submissionsTableFilter,
    };
  }

  mapStateToProps(state) {
    const dataSourceList = selectors.getDatasourceList(state);
    const statusList = submissionStatuses;
    const analysisId = get(state, 'analysisExecution.analysis.data.result.id');

    return {
      dataSourceList,
      statusList,
      analysisId,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.submissionsTableFilter, false),
      redirect: (analysisId, params) => {
        if (!analysisId) {
          return false;
        }
        const url = new URI(paths.analyses(analysisId));
        url.setSearch(params);
        url.setSearch('page', '1');
        return actions.router.goToPage(url.href());
      },
      reset: () => reset(form.submissionsTableFilter),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit(data) {
        dispatchProps.redirect(stateProps.analysisId, data);
        dispatchProps.closeModal();
      },
      doClear() {
        dispatchProps.reset();
        dispatchProps.redirect(stateProps.analysisId, {});
        dispatchProps.closeModal();
      },
    };
  }
}
