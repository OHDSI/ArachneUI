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

// @ts-check
import { Component } from 'react';
import { reduxForm } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form, paths } from 'modules/StudyManager/const';
import { sortOptions, get, Utils } from 'services/Utils';
import CreateModalComponent from './presenter';

const FormCreateModal = reduxForm({ form: form.createStudy })(CreateModalComponent);
const CreateModal = ModalUtils.connect({
  name: modal.createStudy,
})(FormCreateModal);

export default class CreateModalBuidler {
  getComponent() {
    return CreateModal;
  }

  mapStateToProps(state) {
    const typeList = get(state, 'studyManager.typeList.data.result', [], 'Array');
    const typeOptions = typeList.map(s => ({ label: s.name, value: s.id }));

    return {
      studyTypes: sortOptions(typeOptions),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      create: data => actions.studyManager.study.create({}, data),
      show: id => goToPage(paths.studies(id)),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      createStudy(data) {
        const promise = dispatchProps.create({...data, title: data.title.trim()});
        promise.then(res => dispatchProps.show(get(res, 'result.id')))
          .catch(() => {});

        return promise;
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}

