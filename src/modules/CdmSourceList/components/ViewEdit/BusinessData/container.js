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
 * Created: December 21, 2016
 *
 */

import { reduxForm } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import { Utils, get } from 'services/Utils';

import actions from 'actions';
import {
  form,
  paths
} from 'modules/CdmSourceList/const';
import BusinessData from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

class CdmSourceListViewEditBusinessDataBuilder {

  getComponent() {
    return BusinessData;
  }

  mapStateToProps(state) {
    const attrList = selectors.getAttrList(state);
    const dataSourceData = selectors.getData(state);

    return {
      backUrl: paths.dataSources(),
      id: dataSourceData.id,
      isRegistered: get(dataSourceData, 'isRegistered'),
      initialValues: dataSourceData,
      attrList,
    };
  }

  getMapDispatchToProps() {
    return {
      load: actions.cdmSourceList.dataSourceBusiness.query,
      register: actions.cdmSourceList.register,
      update: actions.cdmSourceList.dataSourceBusiness.update,
      unregisterAtCentral: actions.cdmSourceList.unRegister,
      goToPage,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit(data) {
        const submitPromise = stateProps.isRegistered
          ? dispatchProps.update({id: stateProps.id}, data)
          : dispatchProps.register({id: stateProps.id}, data);

        submitPromise
          .then(() => dispatchProps.goToPage(paths.dataSources()))
          .catch(ex => console.warn(ex));

        return submitPromise;
      },
      unregisterAtCentral: () => {
        const id = stateProps.id;
        dispatchProps.unregisterAtCentral({id})
          .then(() => dispatchProps.load({id}))
          .catch(() => {});
      },
    };
  }

  build() {
    const ReduxBusinessData = reduxForm({
      form: form.editSourceBusinessData,
      enableReinitialize: true,
    })(this.getComponent());

    return Utils.buildConnectedComponent({
      Component: ReduxBusinessData,
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}

export default CdmSourceListViewEditBusinessDataBuilder;
