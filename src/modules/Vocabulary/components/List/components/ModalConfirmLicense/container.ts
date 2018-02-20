import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import ModalConfirmLicense from './presenter';

function mapStateToProps(state: any) {
  
	return {
  };
}

const mapDispatchToProps = {
};

const ReduxModalWindow = ModalUtils.connect({ name: modal.confirmLicense })(ModalConfirmLicense);

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps
)
(ReduxModalWindow);
