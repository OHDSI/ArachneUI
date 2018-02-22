import React from 'react';
import { BadgedIcon, Link } from 'arachne-ui-components';

function CellRemove({ id, remove }) {
  return (
    <Link onClick={() => remove(id)}>
      <BadgedIcon icon="delete" />
    </Link>
  );
}

export default CellRemove;
