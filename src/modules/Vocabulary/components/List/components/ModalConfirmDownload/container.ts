import { Component } from 'react';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-components';
import { modal } from 'modules/Vocabulary/const';
import presenter from './presenter';
import { IModalProps } from './presenter';

class ModalConfirmDownload extends Component<IModalProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
	return {};
}

const mapDispatchToProps = {
};

function mergeProps(stateProps, dispatchProps, ownProps): IModalProps {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
  };
}

const ReduxModalWindow = ModalUtils.connect({ name: modal.download })(ModalConfirmDownload);

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)
(ReduxModalWindow);
