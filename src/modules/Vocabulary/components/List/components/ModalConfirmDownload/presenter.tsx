import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-components';

interface IModalProps {
	modal: string;
};

function ModalConfirmDownload(props: IModalProps) {
  const {
    modal,
  } = props;

  return (
    <Modal modal={modal} title='Download confirmation'>
      A link to download has been sent to your email
    </Modal>);
}

export default ModalConfirmDownload;
export { IModalProps };
