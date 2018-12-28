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

import React = require('react');
import { ReactElement } from 'react';
import { Component, Props } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BEMHelper from 'services/BemHelper';
import IModule from 'modules/IModule';
import {
  Header,
  LoadingPanel,
} from 'arachne-ui-components';
import {
  NavItem,
} from 'components';
import AboutInfo from 'modules/Portal/components/AboutInfo';
import imgs from 'const/images';
import { get } from 'lodash';
import LicenseAgreement from 'modules/Portal/components/LicenseAgreement';

interface IAppState extends Props<App> {
  isUserAuthed: boolean;
  isLoggingOut: boolean;
};

interface IAppDispatch {
}

interface IAppOwnProps {
  navItems: Array<ReactElement<any>>;
}

interface IAppProps extends IAppState, IAppDispatch, IAppOwnProps {};

class App extends Component<IAppProps, {}> {

  render() {
    const classes = BEMHelper('root');

    return (
      <div {...classes()}>
        <Header
          {...classes({
            element: 'header',
            modifiers: { empty: this.props.navItems.length === 0 }
          })}
          isUserAuthed={this.props.isUserAuthed}
          logo={imgs.header.logo}
          navItems={this.props.navItems}
        />
        {this.props.children}
        <LoadingPanel active={this.props.isLoggingOut} />
        <AboutInfo />
        <LicenseAgreement />
      </div>
    );
  }
}

function mapStateToProps(state: any): IAppState {
  const isUserAuthed = true;
  const isLoggingOut = get(state, 'auth.logout.isLoading', false);

  return {
    isUserAuthed,
    isLoggingOut,
  };
}

function mapDispatchToProps(dispatch: Function): IAppDispatch {
  return {
  };
}

export default connect<IAppState, IAppDispatch, IAppOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(App);