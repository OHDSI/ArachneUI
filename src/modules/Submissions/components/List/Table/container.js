import actions from 'actions';
import SubmissionsTable from './presenter';
import selectors from './selectors';
import { get, ContainerBuilder } from 'services/Utils';

function getSorting(location) {
  const sort = get(location, 'query.sort', '').split(',');
  const sortBy = get(sort, '[0]', 'id');
  const sortAsc = get(sort, '[1]', 'DESC') === 'ASC';
  return { sortBy, sortAsc };
}

class SubmissionsTableBuilder extends ContainerBuilder {
  getComponent() {
    return SubmissionsTable;
  }

  mapStateToProps(state) {
    return {
      submissionList: selectors.getSubmissionList(state),
      sorting: getSorting(state.routing.locationBeforeTransitions),
    };
  }

  getMapDispatchToProps() {
    return {
      setSearch: actions.router.setSearch,
      addToDownloadQueue: (id) => actions.submissions.fileDownload.addToQueue(id),
      removeFromDownloadQueue: (id) => actions.submissions.fileDownload.removeFromQueue(id),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...ownProps,
      ...dispatchProps,
      setSort: ({ sortBy, sortAsc }) => {
        dispatchProps.setSearch({
          sort: `${sortBy},${sortAsc ? 'ASC' : 'DESC'}`,  // eslint-disable-line space-infix-ops
        });
      },
    };
  }
}

export default SubmissionsTableBuilder;
