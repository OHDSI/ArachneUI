import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
    Modal,
    Button,
    Form,
    FormInput
} from 'arachne-ui-components';
import { FieldArray, Field } from 'redux-form';
import EmailListInput from 'components/EmailListInput';

require('./style.scss');

interface IModalStateProps {
    bundle: any;
    initialValues: any;
    isOpened: boolean;
};

interface IModalDispatchProps {
    share: Function;
    handleSubmit: Function;
    shareBundle: Function;
    reset: Function;
    close: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
  modal: string;
};

function ModalShare(props: IModalProps) {
  const {
    modal,
    share,
    handleSubmit,
    reset,
  } = props;
  const classes = BEMHelper('modal-share');

  return (
    <div {...classes()}>
      <Modal modal={modal} title='Share vocabulary' >
      <form
          {...classes('share-form')}
          onSubmit={handleSubmit(share)}
          {...props}
        >
        <FieldArray name="emailList" component={EmailListInput} />
        </form>
      </Modal>
    </div>);
}

export default ModalShare;
export {
  IModalProps,
  IModalStateProps,
  IModalDispatchProps,
};
