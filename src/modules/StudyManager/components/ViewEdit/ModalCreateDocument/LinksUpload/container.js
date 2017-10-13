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
 * Created: April 10, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import { Utils, buildFormData } from 'services/Utils';
import get from 'lodash/get';
import {
  reduxForm,
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

const FormLinksUpload = reduxForm({
  form: form.createDocumentLinks,
})(LinksUpload);

export default class LinksUploadBuilder {
  getComponent() {
    return FormLinksUpload;
  }

  mapStateToProps(state) {
    const fieldName = 'createDocumentLink';
    const studyData = get(state, 'studyManager.study.data.result');
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
        const submitPromise = Promise.all(submitPromises)
          .then(() => dispatchProps.reset())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy(stateProps.studyId))
          .catch(() => {});

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

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}

