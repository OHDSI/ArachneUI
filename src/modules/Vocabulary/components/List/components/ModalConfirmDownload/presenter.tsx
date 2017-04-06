import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-components';

function ModalConfirmDownload(props: Modal) {
  const {
    modal,
  } = props;

  return (
    <Modal modal={modal} title='Download confirmation'>
      A link to download has been sent to your email
    </Modal>);
}

export default ModalConfirmDownload;
