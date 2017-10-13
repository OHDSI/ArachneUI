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
 * Created: June 23, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import { Utils } from 'services/Utils';
import {
  reduxForm,
  change as reduxFormChange,
  reset as resetForm,
} from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/StudyManager/const';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class AddVirtualSource extends Component {
  static get propTypes() {
    return {
      focusedOwner: PropTypes.string,
      clearOwnerSelector: PropTypes.func,
      addOwner: PropTypes.func,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.focusedOwner !== nextProps.focusedOwner && !!nextProps.focusedOwner) {
      this.props.addOwner(nextProps.focusedOwner);
      this.props.clearOwnerSelector();
    }
  }

  render() {
    return presenter(this.props);
  }
}
const ReduxAddVirtualSource = reduxForm({
  form: form.addVirtualSource,
  enableReinitialize: true,
})(AddVirtualSource);

export default class AddVirtualSourceBuilder {
  getComponent() {
    return ReduxAddVirtualSource;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');

    return {
      studyId: get(studyData, 'id'),
      ownerOptions: selectors.getOwnerOptions(state),
      focusedOwner: get(state, `form.${form.addVirtualSource}.values.ownerSelector`),
      ownerList: selectors.getSelectedOwnerList(state),
      initialValues: {
        ownerList: [selectors.getCurrentUser(state)],
      },
      // dataSourceOptions: selectors.getDataSourceList(state),
    };
  }
  
  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      clearOwnerSelector: () => reduxFormChange(
        form.addVirtualSource,
        'ownerSelector',
        null
      ),
      setOwnerList: value => reduxFormChange(
        form.addVirtualSource,
        'ownerList',
        value
      ),
      addVirtualSource: actions.studyManager.study.dataSource.create,
      loadStudy: actions.studyManager.study.find,
      closeModal: () => ModalUtils.actions.toggle(modal.addDataSource, false),
      resetForm: resetForm.bind(null, form.addVirtualSource),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      addOwner(user) {
        const newOwnerList = stateProps.ownerList.slice();
        newOwnerList.push(user);
        dispatchProps.setOwnerList(newOwnerList);
      },
      removeOwner(user) {
        const newOwnerList = stateProps.ownerList.slice();
        newOwnerList.splice(newOwnerList.indexOf(user), 1);
        dispatchProps.setOwnerList(newOwnerList);
      },
      doSubmit({ name, ownerList }) {
        const submitPromise = dispatchProps.addVirtualSource(
          { studyId: stateProps.studyId },
          {
            name,
            dataOwnersIds: ownerList.map(u => u.id),
          }
        );

        submitPromise
          .then(() => dispatchProps.resetForm())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy(stateProps.studyId))
          .catch(() => {});

        return submitPromise;
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
