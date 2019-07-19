import actions from 'actions/index';
import React, { Component, PropTypes } from 'react';
import { paths, pollTime, modal } from '../../const';
import Presenter from './presenter';
import { ContainerBuilder, get, Utils } from 'services/Utils';

class Submissions extends Component {
  static propTypes = {
    loadSubmissionList: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      if (this.poll) {
        this.isPolledData = false;
        clearInterval(this.poll);
      }
      this.props.loadSubmissionList({ query: nextProps.query });
      this.setPolling(nextProps.query);
    }
  }

  componentDidMount() {
    this.setPolling(this.props.query);
  }

  componentWillUnmount() {
    console.log('cwU');
    if (this.poll) {
      clearInterval(this.poll);
    }
  }

  setPolling(query) {
    this.poll = setInterval(() => {
      this.isPolledData = true;
      const { isModalOpened } = this.props;
      !isModalOpened && this.props.loadSubmissionList({ query })
    }, pollTime);
  }

  render() {
    return <Presenter {...this.props} isLoading={this.props.isLoading && !this.isPolledData} />;
  }
}

class SubmissionsBuilder extends ContainerBuilder {
  getComponent() {
    return Submissions;
  }

  mapStateToProps(state, ownProps) {
    const path = get(state, 'routing.locationBeforeTransitions', {
      pathname: paths.submissions(),
      search: '',
    });
    return {
      isLoading: state.submissions.submissionList.isLoading,
      isModalOpened: get(state, `modal.${modal.createSubmission}.isOpened`, false),
      query: state.routing.locationBeforeTransitions.query,
      currentPage: parseInt(get(state, 'routing.locationBeforeTransitions.query.page', 0), 0),
      pages: get(state, 'submissions.submissionList.queryResult.totalPages', 1),
      path: path.pathname + path.search,
    };
  }

  getMapDispatchToProps() {
    return {
      loadSubmissionList: actions.submissions.submissionList.query,
      invalidateAnalyses: actions.submissions.invalidateAnalyses.create,
    };
  }


  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      async invalidateAndRefresh() {
        try {
          await Utils.confirmDelete({ message: "Do you really want to invalidate all unfinished submissions?" })
          await dispatchProps.invalidateAnalyses();
          await dispatchProps.loadSubmissionList({ query: null });
         } catch (err) {
           console.error(err);
         }
      },
    }
  }

  getFetchers({ params, state, dispatch }) {
    const query = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');
    return {
      promise: actions.submissions.submissionList.query.bind(null, { query }),
    };
  }
}

export default SubmissionsBuilder;