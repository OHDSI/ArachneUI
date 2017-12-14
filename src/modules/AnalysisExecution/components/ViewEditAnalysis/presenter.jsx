/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 27, 2016
 *
 */

// @ts-check
import React, { Component, PropTypes } from 'react';
import {
  PageContent,
  LoadingPanel,
  Link,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import InviteBanner from 'components/Banners/Invite';
import Toolbar from './Toolbar/index';
import Settings from './Settings/index';
import Description from './Description/index';
import ListCode from './ListCode/index';
import ListSubmissions from './ListSubmissions/index';
import ModalEditTitle from './ModalEditTitle/index';
import ModalCreateCode from './ModalCreateCode/index';
import ModalCreateInsight from './ModalCreateInsight';
import ModalSubmitCode from './ModalSubmitCode/index';
import ModalFiles from './ModalFiles/index';
import ModalStatusHistory from './ModalStatusHistory';
import ModalUploadResult from './ModalUploadResult';
import ModalRejectSubmission from './ModalRejectSubmission';


import './style.scss';
import { modules } from 'const/banner';

/** @augments{ Component<any, any> } */
export default class ViewEditAnalysis extends Component {
  get propTypes() {
    return {
      studyUrl: PropTypes.string,
      isLoading: PropTypes.bool,
      pageTitle: PropTypes.string,
    };
  }

  constructor() {
    super();
    this.classes = BEMHelper('analysis-view');
  }

  getModals() {
    return [
      <ModalEditTitle />,
      <ModalCreateCode />,
      <ModalCreateInsight />,
      <ModalSubmitCode />,
      <ModalFiles />,
      <ModalStatusHistory />,
      <ModalUploadResult />,
      <ModalRejectSubmission />,
    ];
  }

  render() {
    this.studyUrl = this.props.studyUrl;
    const isLoading = this.props.isLoading;
    this.pageTitle = this.props.pageTitle;    

    return (
      <PageContent title={this.pageTitle}>
        <div {...this.classes()}>
          <InviteBanner
            {...this.classes('container')}
            id={this.props.id}
            studyId={this.props.studyId}
            module={modules.analysis}
          >
            <Toolbar />
            <div {...this.classes('content')}>
              <div className="row">
                <div className="col-xs-12 col-md-6">
                  <Settings />
                  <Description />
                </div>
                <div className="col-xs-12 col-md-6">
                  <ListCode />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <ListSubmissions />
                </div>
              </div>
            </div>
          </InviteBanner>
          {this.getModals()}
          <LoadingPanel active={isLoading} />
        </div>
      </PageContent>
    );
  }
}
