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
 * Created: November 09, 2017
 *
 */

import { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ContainerBuilder } from 'services/Utils';
import Chart from './Chart';
import { treemap } from '@ohdsi/atlascharts/dist/atlascharts.umd';

class TreemapReport extends Component {
  static get propTypes() {
    return {
      loadDetails: PropTypes.func.isRequired,
      dataSourceId: PropTypes.number.isRequired,
      details: PropTypes.object,
      filePath: PropTypes.string.isRequired,
      getFilename: PropTypes.func.isRequired,
    };
  }

  constructor() {
    super();
    this.initialZoomedConcept = null;
    this.onZoom = this.onZoom.bind(this);
    this.loadConditionDetails = this.loadConditionDetails.bind(this);
  }

  onZoom(concept) {
    this.initialZoomedConcept = concept;
  }

  loadConditionDetails(conceptId) {
    this.props.loadDetails({
      id: this.props.dataSourceId,
      path: this.props.filePath,
      filename: this.props.getFilename(conceptId),
    });
  }

  isEmpty(obj) {
    return Object.values(obj).reduce(
      (result, nextValue) => {
        if (!isEmpty(nextValue)) {
          return false;
        }
        return result;
      },
      true
    );
  }

  render() {
    return this.props.presenter({
      ...this.props,
      details: this.isEmpty(this.props.details)
        ? null
        : this.props.details,
      onZoom: this.onZoom,
      initialZoomedConcept: this.initialZoomedConcept,
      loadConditionDetails: this.loadConditionDetails,
    });
  }
}

export default class TreemapReportBuilder extends ContainerBuilder {
  constructor() {
    super();
    this.filePath = '';
    this.presenter = null;
    this.mergeProps = this.mergeProps.bind(this);
    this.treemap = new treemap();
  }

  getComponent() {
    return TreemapReport;
  }

  mapStateToProps(state, ownProps) {
    const {
      data,
      details,
      tableData,
      tableColumns,
    } = ownProps;

    return {
      conditions: data,
      details,
      tableData,
      tableColumns,
      treemap: this.treemap
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      getFilename: this.getFilename,
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      filePath: this.filePath,
      presenter: this.presenter,
    };
  }
}
