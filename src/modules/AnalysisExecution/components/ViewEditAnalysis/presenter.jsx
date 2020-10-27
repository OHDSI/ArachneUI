/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import InviteRestrictedArea from 'components/InviteRestrictedArea';
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
import ModalUpdateDescription from './ModalUpdateDescription/index';
import ModalRejectSubmission from './ModalRejectSubmission';
import ModalAddDataSource from 'modules/StudyManager/components/ViewEdit/ModalAddDataSource';
import ModalError from './ModalCreateCode/components/ModalError';
import EmptyState from 'components/EmptyState';

import './style.scss';

/** @augments{ Component<any, any> } */
export default class ViewEditAnalysis extends Component {
  static get propTypes() {
    return {
      studyUrl: PropTypes.string,
      isLoading: PropTypes.bool,
      pageTitle: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.classes = BEMHelper('analysis-view');
  }

  getModals() {
    return [
      <ModalEditTitle key="editTitle" />,
      <ModalCreateCode key="createCode" />,
      <ModalCreateInsight key="createInsight" />,
      <ModalSubmitCode key="submitCode" />,
      <ModalFiles key="files" />,
      <ModalStatusHistory key="statusHistory" />,
      <ModalUploadResult key="uploadResult" />,
      <ModalUpdateDescription key="updateDescription" />,
      <ModalRejectSubmission key="rejectSubmission" />,
      <ModalAddDataSource onAdd={this.props.refreshStudyDataSources} key="addDataSource" />,
      <ModalError key="error" />,
    ];
  }

  render() {
    this.studyUrl = this.props.studyUrl;
    this.pageTitle = this.props.pageTitle;

    const {
      isLoading,
      isEditable,
      canView,
    } = this.props;

    return (
      <PageContent title={this.pageTitle}>
        {canView ?
        <div {...this.classes()}>
          <InviteRestrictedArea
            {...this.classes('container')}
            studyId={this.props.studyId}
            onAction={this.props.onBannerActed}
            disabled={isLoading}
          >
            <Toolbar isEditable={isEditable} />
            <div {...this.classes('content')}>
              <div className="row">
                <div className="col-xs-12 col-md-6">
                  <Settings isEditable={isEditable} />
                  <Description isEditable={isEditable} />
                </div>
                <div className="col-xs-12 col-md-6">
                  <ListCode isEditable={isEditable} />
                </div>
              </div>
              <div {...this.classes('row', '', 'row')}>
                <div {...this.classes('subrow', '', 'col-xs-12')}>
                  <ListSubmissions isEditable={isEditable} />
                </div>
              </div>
            </div>
          </InviteRestrictedArea>
          {this.getModals()}
          <LoadingPanel active={isLoading} />
        </div>
        : <EmptyState message={'Access denied or analysis does not exist'} />
        }
      </PageContent>
    );
  }
}
