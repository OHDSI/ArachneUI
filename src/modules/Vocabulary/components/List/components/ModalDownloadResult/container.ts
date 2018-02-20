import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import ModalDownloadResult from './presenter';

function mapStateToProps(state: any) {
  
	return {    
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.downloadResult, false),
};

const ReduxModalWindow = ModalUtils.connect({ name: modal.downloadResult })(ModalDownloadResult);

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps
)
(ReduxModalWindow);
