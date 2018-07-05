/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { connect } from 'react-redux';
import { Component } from 'react';
import { get } from 'lodash';
import { NavItem as INavItem } from 'modules/IModule';
import presenter from './presenter';

interface INavitemDispatchProps {
}

interface INavitemStateProps {
}

interface INavitemProps extends INavitemStateProps, INavitemDispatchProps, INavItem {}

class NavItem extends Component<INavItem, void> {

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: INavItem): INavitemStateProps {
  const isActive = get(state, 'modules.active', '') === ownProps.module;

  return {
    isActive,
  };
}

const mapDispatchToProps = {
};

function mergeProps(
  stateProps: INavitemStateProps,
  dispatchProps: INavitemDispatchProps,
  ownProps: INavItem
) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  };
}

export default connect<INavitemStateProps, INavitemDispatchProps, INavItem>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NavItem);
