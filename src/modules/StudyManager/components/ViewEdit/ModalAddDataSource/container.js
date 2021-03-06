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

import {
  ContainerBuilder,
  Utils
} from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/StudyManager/const';
import presenter from './presenter';
import { get } from 'services/Utils';

const ModalAddDataSource = ModalUtils.connect({
  name: modal.addDataSource,
})(presenter);

export default class ModalAddDataSourceBuilder extends ContainerBuilder {
  getComponent() {
    return ModalAddDataSource;
  }

  mapStateToProps(state) {
    return {
      dataSourceId: get(state, 'modal.addDataSource.data.dataSourceId'),
    }
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
    });
  }
}
