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
 * Created: August 30, 2017
 *
 */

// @ts-check
import { Utils, ContainerBuilder } from 'services/Utils';
import { push as goToPage } from 'react-router-redux';
import {
  paths,
  statusColors,
  studyListPageSize,
  studyListPageSizeCards,
} from 'modules/StudyManager/const';
import moment from 'moment';
import { humanDate } from 'const/formats';
import actions from 'actions/index';
import get from 'lodash/get';
import URI from 'urijs';
import viewModes from 'const/viewModes';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

export default class List extends ContainerBuilder {
  getComponent() {
    return presenter;
  }

  static getSorting(location) {
    return {
      sortBy: location.query.sortBy,
      sortAsc: location.query.sortAsc === 'true',
    };
  }

  mapStateToProps(state) {
    const query = state.routing.locationBeforeTransitions.query;
    const isCardsView = query.view === viewModes.CARDS;
    const searchQuery = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');

    return {
      sorting: List.getSorting(state.routing.locationBeforeTransitions),
      searchQuery,
      data: selectors.getStudyList(state),
      userLinkFormatter: data => ({
        link: paths.user(data.id),
        label: `${data.firstname} ${data.lastname}`,
      }),
      createdFormatter: timestamp => moment(timestamp).format(humanDate),
      typeFormatter: type => (type ? type.name : null),
      statusFormatter: (status) => {
        if (status) {
          return {
            color: status.name ? statusColors[status.name.toLowerCase()] : null,
            label: status.name,
          };
        }
        return {};
      },
      isCardsView,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      search: (searchParams) => {
        const url = new URI(paths.studies());
        url.setSearch(searchParams);
        return goToPage(url.href());
      },
      loadStudies: actions.studyManager.studyList.find,
      goToStudy: id => goToPage(paths.studies(id)),
      setFavourite: actions.studyManager.studyList.setFavourite,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      setFavourite: (studyId, isFavourite) => dispatchProps.setFavourite(studyId, isFavourite)
        .then(() => dispatchProps.loadStudies({
          ...stateProps.searchQuery,
          pagesize: stateProps.isCardsView ? studyListPageSizeCards : studyListPageSize,
        }))
        .catch(() => {}),
      setSorting: (sortParams) => {
        const searchParams = {
          ...stateProps.searchQuery,
          ...sortParams,
        };
        dispatchProps.search(searchParams);
      }
    }
  }
}
