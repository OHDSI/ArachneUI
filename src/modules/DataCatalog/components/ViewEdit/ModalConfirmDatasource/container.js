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
 * Created: February 07, 2017
 *
 */

import get from 'lodash/get';
import { modal } from 'modules/DataCatalog/const';
import { ContainerBuilder } from 'services/Utils';
import ModalConfirmDatasource from './presenter';

class ModalConfirmDSInviteBuilder extends ContainerBuilder {

  getComponent() {
    return ModalConfirmDatasource;
  }

  mapStateToProps(state) {
    const modalData = state.modal[modal.confirmDatasource];

    return {
      datasourceName: get(modalData, 'data.datasourceName', ''),
      studyId: get(modalData, 'data.study.value', -1),
      studyName: get(modalData, 'data.study.label'),
    };
  }

  getModalParams() {
    return {
      name: modal.confirmDatasource,
    };
  }
}

export default ModalConfirmDSInviteBuilder;
