import { Component } from 'react';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { connect } from 'react-redux';
import { modal } from 'modules/Portal/const';
import actions from 'modules/Portal/actions';
import presenter from './presenter';

interface IStateProps {
  buildId: string,
  buildNumber: string,
  isLoading: boolean,
  projectVersion: string,
}

interface IDispatchProps {
  loadBuildInfo: Function,
  hideModal: Function,
}

class AboutInfo extends Component<IStateProps & IDispatchProps & { modal: Object }, {}> {
  componentWillMount() {
    this.props.loadBuildInfo();
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  return <IStateProps> {
    buildNumber: get(state, 'portal.buildInfo.data.buildNumber'),
    buildId: get(state, 'portal.buildInfo.data.buildId'),
    isLoading: get(state, 'portal.buildInfo.isLoading'),
    projectVersion: get(state, 'portal.buildInfo.data.projectVersion'),
  };
}

const mapDispatchToProps = {
  loadBuildInfo: actions.buildInfo.load,
  hideModal: () => ModalUtils.actions.toggle(modal.portalAboutInfo, false),
};

const ModalAboutInfo = ModalUtils.connect({
  name: modal.portalAboutInfo,
})(AboutInfo);

export default connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(ModalAboutInfo);
