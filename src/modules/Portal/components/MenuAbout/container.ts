import { Component } from 'react';
import { get } from 'lodash';
import { ModalUtils } from 'arachne-components';
import { connect } from 'react-redux';
import { modal } from 'modules/Portal/const';
import actions from 'modules/Portal/actions';
import MenuAbout from './presenter';

interface IStateProps {
}

interface IDispatchProps {
  openModal: Function,
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  openModal: () => ModalUtils.actions.toggle(modal.portalAboutInfo, true),
};

export default connect<IStateProps, IDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(MenuAbout);
