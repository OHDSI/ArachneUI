import actions from 'actions';
import SubmissionsTable from './presenter';
import selectors from './selectors';
import { get, ContainerBuilder } from 'services/Utils';
import { downloadFile } from 'services/Utils';
import { links } from 'modules/Submissions/const';
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
      downloadingIds: get(state, 'submissions.fileDownload.ids', []),
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
      async downloadResults(id, filename) {
        const url = links.downloadResults(id);
        try {
          dispatchProps.addToDownloadQueue(id);
          await downloadFile(url, filename);
        } catch (err) {
          console.error(err);
        } finally {
          dispatchProps.removeFromDownloadQueue(id);
        }
      }
    };
  }
}

export default SubmissionsTableBuilder;