import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Table,
  TableCellText,
  Link,
} from 'arachne-components';

require('./style.scss');

interface IListProps {
  licenses: Array<any>;
};

function CellRemove() {
  return <Button>Remove</Button>;
}


function CellVocabs({ value, openEditModal }) {
  return <Link onClick={openEditModal}>{`${value.length} vocabularies`}</Link>;
}

function Results(props: IListProps) {
  const {
    licenses,
    openEditModal,
  } = props;
  const classes = BEMHelper('licenses-list');

  return (
    <div {...classes()}>
      <Table
        data={licenses}
        mods={['padded']}
      >
        <TableCellText
          {...classes('name')}
          header='User'
          field='user.name'
        />
        <CellVocabs
          {...classes('voc')}
          header='Vocabularies'
          field='vocabularies'
          props={(entity) => ({
            value: entity.vocabularies,
            openEditModal: () => openEditModal(entity),
          })}
        />
        <CellRemove
        />
      </Table>
     </div>
  );
}

export default Results;
