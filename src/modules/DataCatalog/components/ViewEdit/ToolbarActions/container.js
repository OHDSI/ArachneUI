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
import { dataSourcePermissions } from 'modules/DataCatalog/const';
import actions from 'actions/index';
import get from 'lodash/get';
import { Utils } from 'services/Utils';
import ToolbarActions from './presenter';

function mapStateToProps(state) {
  const datasourceData = get(state, 'dataCatalog.dataSource.data.result');
  const isDeleted = !!get(datasourceData, 'deleted', '');
  const isDeletable = get(datasourceData, `permissions[${dataSourcePermissions.delete}]`, false);
  const canDelete = !isDeleted && isDeletable;
  const dataSourceId = get(datasourceData, 'id', '');

  return {
    canDelete,
    dataSourceId,
  };
}

const mapDispatchToProps = {
  load: actions.dataCatalog.dataSource.find,
  remove: actions.dataCatalog.dataSource.delete,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    remove: () => {
      Utils.confirmDelete()
        .then(() => {
          const dataSourceId = stateProps.dataSourceId;
          dispatchProps.remove(dataSourceId)
            .then(() => dispatchProps.load(dataSourceId))
            .catch(() => {});
        });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ToolbarActions);
