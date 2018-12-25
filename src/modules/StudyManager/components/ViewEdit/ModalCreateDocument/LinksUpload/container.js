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
 * Created: April 10, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import { buildFormData, ContainerBuilder } from 'services/Utils';
import { get } from 'services/Utils';
import {
  change as reduxFormChange,
  reset as resetForm,
} from 'redux-form';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/StudyManager/const';
import presenter from './presenter';

/** @augments { Component<any, any> } */
export class LinksUpload extends Component {
  static get propTypes() {
    return {
      addLink: PropTypes.func,
    };
  }
  componentWillMount() {
    this.props.addLink();
  }

  render() {
    return presenter(this.props);
  }
}

export default class LinksUploadBuilder extends ContainerBuilder {
  getComponent() {
    return LinksUpload;
  }

  getFormParams() {
    return {
      form: form.createDocumentLinks,
    };
  }

  mapStateToProps(state) {
    const fieldName = 'createDocumentLink';
    const studyData = get(state, 'studyManager.study.data');
    const links = get(state, `form.createDocumentLinks.values.${fieldName}`, []);
    const addButtonTitle = links.length === 0 ? 'Add link' : 'Add another link';

    return {
      studyId: get(studyData, 'id'),
      initialValues: {
        createDocumentLink: links,
      },
      links,
      addButtonTitle,
      fieldName,
      canSubmit: links.filter(link => link.label && link.value).length > 0,
    };
  }

  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.createDocument, false),
      createDocument: actions.studyManager.study.document.create,
      loadStudy: actions.studyManager.study.find,
      add: val => reduxFormChange(form.createDocumentLinks, 'createDocumentLink', val),
      reset: () => resetForm.bind(null, form.createDocumentLinks),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit() {
        const submitPromises = stateProps.links.map(link =>
          dispatchProps.createDocument({ studyId: stateProps.studyId },
            buildFormData({
              label: link.label ? link.label : link.value,
              link: link.value,
            })
          )
        );
        const submitPromise = Promise.all(submitPromises);
        submitPromise.then(() => dispatchProps.reset())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }))
          .catch((er) => {
            console.error(er);
          });

        // We have to return a submission promise back to redux-form
        // to allow it update the state
        return submitPromise;
      },
      addLink() {
        const links = [].concat(stateProps.links);
        links.push({
          label: '',
          value: '',
        });
        dispatchProps.add(links);
      },
    };
  }
}

