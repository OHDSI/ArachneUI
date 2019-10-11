import React from 'react';
import BEMHelper from 'services/BemHelper';
import Table from './Table';
import Actions from './Table/Actions';
import { LoadingPanel, Pagination, PageContent, Toolbar } from 'arachne-ui-components';
import ModalCreateSubmission from './ModalСreateSubmission';

require('./styles.scss');

function SubmissionsMonitoring(props) {
  const classes = new BEMHelper('submissions-panel');
  const { isLoading, currentPage, pages, path } = props;

  return (
    <PageContent title="Submissions | Arachne">
      <div {...classes()}>
        <Toolbar caption="Submissions">
          <Actions />
        </Toolbar>
        <div {...classes('table-wrapper')}>
          <Table />
        </div>
        <div {...classes('pagination-wrapper')}>
          <div {...classes('pagination')}>
            <Pagination
              pages={pages}
              currentPage={currentPage}
              path={path}
              isFromZero
            />
          </div>
        </div>
        <ModalCreateSubmission />
        <LoadingPanel active={isLoading} />
      </div>
    </PageContent>
  );
}

export default SubmissionsMonitoring;
