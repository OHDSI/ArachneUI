import { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ContainerBuilder } from 'services/Utils';

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
