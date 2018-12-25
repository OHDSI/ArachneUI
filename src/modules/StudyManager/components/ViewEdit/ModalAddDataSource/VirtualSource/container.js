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
 * Created: June 23, 2017
 *
 */
// @ts-check
import {
  Component,
  PropTypes
} from 'react';
import { Utils } from 'services/Utils';
import {
  change as reduxFormChange,
  reduxForm,
  reset as resetForm
} from 'redux-form';
import { get } from 'services/Utils';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import {
  form,
  modal
} from 'modules/StudyManager/const';
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

  componentWillMount() {
    const dataSourceId = this.props.dataSourceId;
    if (dataSourceId) {
      this.props.loadDataSource({ studyId: this.props.studyId, dataSourceId });
    }
  }

  componentWillUnmount() {
      this.props.unloadDataSource();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.focusedOwner !== nextProps.focusedOwner && !!nextProps.focusedOwner) {
      this.props.addOwner(nextProps.focusedOwner);
      this.props.clearOwnerSelector();
    }
    const dataSourceId = nextProps.dataSourceId;
    if (dataSourceId && this.props.dataSourceId !== dataSourceId) {
      this.props.loadDataSource({ studyId: this.props.studyId, dataSourceId });
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
    const studyData = get(state, 'studyManager.study.data');
    const dataSourceData = get(state, 'studyManager.study.dataSource.data');
    const ownerList = selectors.getDataSourceOwnerList(state);

    return {
      studyId: get(studyData, 'id'),
      ownerOptions: selectors.getOwnerOptions(state),
      focusedOwner: get(state, `form.${form.addVirtualSource}.values.ownerSelector`),
      ownerList: selectors.getSelectedOwnerList(state),
      initialValues: {
        ownerList: ownerList ? ownerList : [selectors.getCurrentUser(state)],
        name: get(dataSourceData, 'name'),
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
      updateVirtualSource: actions.studyManager.study.dataSource.update,
      loadStudy: actions.studyManager.study.find,
      loadDataSource: actions.studyManager.study.dataSource.find,
      unloadDataSource: actions.studyManager.study.dataSource.unload,
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
        const submitPromise = ownProps.dataSourceId
          ? dispatchProps.updateVirtualSource(
            { studyId: stateProps.studyId, dataSourceId: ownProps.dataSourceId },
            {
              name,
              dataOwnersIds: ownerList.map(u => u.id),
            }
          )
          : dispatchProps.addVirtualSource(
          { studyId: stateProps.studyId },
          {
            name,
            dataOwnersIds: ownerList.map(u => u.id),
          }
        );

        submitPromise
          .then(() => dispatchProps.resetForm())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }))
          .then(ownProps.onAdd)
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
