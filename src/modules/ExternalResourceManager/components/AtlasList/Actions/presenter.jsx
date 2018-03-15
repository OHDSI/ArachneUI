import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
} from 'arachne-ui-components';

import './style.scss';

function AtlasesActions(props) {
  const classes = new BEMHelper('atlases-actions');
  const {
    openNewAtlasModal,
    refresh,
  } = props;

  return (
    <ul {...classes()}>
      <li {...classes('action')}>
        <Button {...classes('btn')} onClick={openNewAtlasModal}>
          <i {...classes('btn-ico')}>add_circle_outline</i>
        </Button>
      </li>
      <li {...classes('action')}>
        <Button {...classes('btn')} onClick={refresh}>
          <i {...classes('btn-ico')}>refresh</i>
        </Button>
      </li>
    </ul>
  );
}

export default AtlasesActions;
