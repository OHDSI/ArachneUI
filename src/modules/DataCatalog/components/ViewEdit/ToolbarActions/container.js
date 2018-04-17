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
 * Created: August 25, 2017
 *
 */

import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { dataSourcePermissions, paths } from 'modules/DataCatalog/const';
import actions from 'actions';
import get from 'lodash/get';
import { Utils } from 'services/Utils';
import URI from 'urijs';
import ToolbarActions from './presenter';

function mapStateToProps(state, ownProps) {
  const datasourceData = get(state, 'dataCatalog.dataSource.data.result');
  const isPublished = get(datasourceData, 'published', '');
  const hasEditPermission = get(datasourceData, `permissions[${dataSourcePermissions.edit}]`, false);
  
  const canUnpublish = isPublished && hasEditPermission;
  const dataSourceId = get(datasourceData, 'id', '');
  const isMy = get(state, 'routing.locationBeforeTransitions.query.my', false);
  const editUrl = new URI(paths.edit(dataSourceId));
  if (isMy) {
    editUrl.setSearch({
      my: true,
    });
  }

  return {
    canUnpublish: ownProps.mode === 'edit' ? canUnpublish : false,
    canEdit: ownProps.mode === 'view' ? hasEditPermission : false,
    dataSourceId,
    editUrl: editUrl.href(),
  };
}

const mapDispatchToProps = {
  load: actions.dataCatalog.dataSource.find,
  unpublish: actions.dataCatalog.registration.delete,
  goToPage,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    async unpublish() {
      try {
        await Utils.confirmDelete();
        const dataSourceId = stateProps.dataSourceId;
        await dispatchProps.unpublish({ id: dataSourceId });
        await dispatchProps.load({ id: dataSourceId });
        await dispatchProps.goToPage(paths.dataCatalog());
      } catch (er) {
        console.error(er);
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ToolbarActions);
