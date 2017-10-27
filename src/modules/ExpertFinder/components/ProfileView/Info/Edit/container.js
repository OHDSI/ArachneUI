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
 * Created: January 16, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { reduxForm, reset as resetForm } from 'redux-form';
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { forms } from 'modules/ExpertFinder/const';
import { Utils } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';

class BasicInfoEdit extends Component {
  componentWillMount() {
    this.props.getProfessionalTypes();
  }

  render() {
    return presenter(this.props);
  }
}

BasicInfoEdit.propTypes = {
  getProfessionalTypes: PropTypes.func,
};

export default class BasicInfoEditBuilder {
  getComponent() {
    return reduxForm({
      form: forms.general,
      enableReinitialize: true,
    })(BasicInfoEdit);
  }

  mapStateToProps(state) {
    const moduleState = state.expertFinder.userProfile;
    const generalData = get(moduleState, 'data.result.general', {
      affiliation: '',
      professionalType: {
        name: '',
      },
    });
    const id = get(moduleState, 'data.result.id', '');

    return {
      initialValues: {
        affiliation: generalData.affiliation,
        professionalType: generalData.professionalType.id,
      },
      id,
      professionalTypes: selectors.getProfessionalTypes(state),
    };
  }

  getMapDispatchToProps() {
    return {
      resetForm: resetForm.bind(null, forms.general),
      updateGeneralInfo: actions.expertFinder.userProfile.generalInfo.update,
      loadInfo: actions.expertFinder.userProfile.find,
      getProfessionalTypes: actions.expertFinder.professionalType.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      cancel: () => ownProps.setViewMode(),
      doSubmit: ({ affiliation, professionalType }) => {
        const submitPromise = dispatchProps.updateGeneralInfo(null, {
          affiliation,
          professionalType: {
            id: professionalType,
          },
        });
        submitPromise.then(() => dispatchProps.resetForm())
          .then(() => ownProps.setViewMode())
          .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
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
