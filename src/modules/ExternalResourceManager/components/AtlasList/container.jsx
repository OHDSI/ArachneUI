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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import { Component, PropTypes } from 'react';
import URI from 'urijs';
import { get, ContainerBuilder } from 'services/Utils';
import PageableUtils from 'services/PageableUtils';
import { push as goToPage, replace } from 'react-router-redux';
import { ModalUtils } from 'arachne-ui-components';
import presenter from './presenter';
import actions from 'actions';
import { paths, modal } from 'modules/ExternalResourceManager/const';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class AtlasList extends Component {
  static get propTypes() {
    return {
      query: PropTypes.object,
      loadAtlasList: PropTypes.func,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      nextProps.loadAtlasList({}, nextProps.query);
    }
  }

  render() {
    return presenter(this.props);
  }
}

export default class ListBuilder extends ContainerBuilder {
  getComponent() {
    return AtlasList;
  }

  mapStateToProps(state) {
    return {
      isLoading: selectors.getIsLoading(state),
      atlasList: selectors.getAtlasList(state),
      query: get(state, 'routing.locationBeforeTransitions.query', {}, 'Object'),
      paginationDetails: selectors.getPaginationDetails(state),
      sorting: PageableUtils.getSorting(state),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      search: (searchParams) => {
        const url = new URI(paths.atlases());
        url.setSearch(searchParams);
        return goToPage(url.href());
      },
      loadAtlasList: actions.externalResourceManager.atlases.query,
      checkConnection: id => actions.externalResourceManager.atlases.checkConnection({ id }),
      editAtlas: id => ModalUtils.actions.toggle(modal.atlasDetails, true, { id }),
      deleteAtlas: actions.externalResourceManager.atlases.delete,
      redirect: addr => replace(addr),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      setSorting: PageableUtils.setSorting.bind(null, dispatchProps.search, stateProps.query),
      reload: () => dispatchProps.loadAtlasList({}, stateProps.query),
      async deleteAtlas(id) {
        await dispatchProps.deleteAtlas({ id });
        dispatchProps.loadAtlasList();
      },
      onPageOutOfRange() {
        dispatchProps.redirect(paths.atlases());
      },
      async checkConnection(id) {
        await dispatchProps.checkConnection(id);
        dispatchProps.loadAtlasList();
      },
    };
  }

  getFetchers({ params, state, dispatch }) {
    return {
      loadAtlasList: actions.externalResourceManager.atlases.query,
    };
  }

}
