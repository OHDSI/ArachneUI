import React from 'react';
import BemHelper from 'services/BemHelper';
import { Link } from 'arachne-ui-components';

import './style.scss';

function CellRemove({ id, remove, isRemovable }) {
  const classes = new BemHelper('table-cell-remove');
  return isRemovable
    ? <Link {...classes()} onClick={() => remove(id)}>
        <i {...classes('icon')}>delete</i>
      </Link>
    : null;
}

export default CellRemove;
