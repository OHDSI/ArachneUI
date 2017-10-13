/**
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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { Component } from 'react';
import { Utils, ContainerBuilder, get } from 'services/Utils';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import viewModes from 'const/viewModes';
import Uri from 'urijs';
import { paths } from 'modules/StudyManager/const';
import { push as goToPage } from 'react-router-redux';
import presenter from './presenter';

export class StudyView extends Component {
  render() {
    return presenter(this.props);
  }
}

export default class StudyViewBuilder extends ContainerBuilder {
  getComponent() {
    return StudyView;
  }

  mapStateToProps(state) {
    const cleanPath = get(state, 'routing.locationBeforeTransitions.pathname');
    const currentQuery = state.routing.locationBeforeTransitions.query;

    return {
      cleanPath,
      currentQuery,
      isCardsView: currentQuery.view === viewModes.CARDS,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      openCreateStudyModal: () => ModalUtils.actions.toggle('createStudy', true),
      go: address => goToPage(address),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      refresh() {
        const url = new Uri(stateProps.cleanPath);
        url.setSearch(stateProps.currentQuery);
        url.setSearch({
          hash: Math.random().toString(36).substring(7),
        });
        dispatchProps.go(url.href());
      },
      setViewMode(view) {
        const url = new Uri(stateProps.cleanPath);
        url.setSearch(stateProps.currentQuery);
        url.setSearch({
          page: 1,
          view,
        });
        dispatchProps.go(url.href());
      },
    };
  }

}
