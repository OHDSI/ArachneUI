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
 * Created: April 07, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  reduxForm,
  change as reduxFormChange,
  reset as resetForm,
} from 'redux-form';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import { buildFormData } from 'services/Utils';
import presenter from './presenter';

class LinksUpload extends Component {
  componentWillMount() {
    this.props.addLink();
  }

  render() {
    return presenter(this.props);
  }
}

LinksUpload.propTypes = {
  addLink: PropTypes.func,
};

function mapStateToProps(state) {
  const fieldName = 'createCodeLink';
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const links = get(state, `form.createCodeLinks.values.${fieldName}`, []);
  const addButtonTitle = links.length === 0 ? 'Add link' : 'Add another link';

  return {
    analysisId: get(analysisData, 'id'),
    initialValues: {
      createCodeLink: links,
    },
    links,
    addButtonTitle,
    fieldName,
    canSubmit: links.filter(link => link.label && link.value).length > 0,
  };
}

const mapDispatchToProps = {
  closeModal: () => ModalUtils.actions.toggle(modal.createCode, false),
  createCode: actions.analysisExecution.code.create,
  loadAnalysis: actions.analysisExecution.analysis.find,
  add: val => reduxFormChange(form.createCodeLinks, 'createCodeLink', val),
  reset: () => resetForm.bind(null, form.createCodeLinks),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit() {
      const submitPromises = stateProps.links.map(link =>
        dispatchProps.createCode(
          {
            analysisId: stateProps.analysisId,
          },
          buildFormData({
            label: link.label ? link.label : link.value,
            link: link.value,
          })
        )
      );
      const submitPromise = Promise.all(submitPromises);
      submitPromise.then(() => dispatchProps.reset())
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }))
        .catch((er) => {
          console.error(er)
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

const FormLinksUpload = reduxForm({
  form: form.createCodeLinks,
})(LinksUpload);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FormLinksUpload);
