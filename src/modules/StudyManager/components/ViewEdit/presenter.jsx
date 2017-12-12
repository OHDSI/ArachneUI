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

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { StickyContainer, Sticky } from 'react-sticky';
import { headerHeight } from 'const/style';

import { LoadingPanel, PageContent, Link } from 'arachne-ui-components';

import DateInterval from './DateInterval';
import Toolbar from './Toolbar';
import InviteBanner from './InviteBanner';

import ModalEditTitle from './ModalEditTitle';
import ModalAddParticipant from './ModalAddParticipant';
import ModalConfirmParticipant from './ModalConfirmParticipant';
import ModalAddDataSource from './ModalAddDataSource';
import ModalConfirmDatasource from './ModalConfirmDatasource';
import ModalCreateDocument from './ModalCreateDocument';
import ModalCreateAnalysis from './ModalCreateAnalysis';

import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';

require('./style.scss');

function ViewEditStudy(props) {
  const { studyTitle, isLoading, id, accessGranted, goBack } = props;
  const classes = new BEMHelper('study-manager-view');

  return (
    <PageContent title={`${studyTitle} | Arachne`}>
      <div {...classes()}>
        {accessGranted
        ? [
          <StickyContainer {...classes('container')}>
            <Toolbar studyId={id} />
            <Sticky>
              {
                ({ isSticky }) => <InviteBanner className={ isSticky ? classes('sticky-banner').className : null } />
              }
            </Sticky>
            <div {...classes('content')}>
              <div className="row">
                <div className="col-xs-12 col-lg-6">
                  <DateInterval />
                  <div className="row">
                    <div className="col-xs-12">
                      <LeftColumn />
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-lg-6">
                  <RightColumn studyId={id} />
                </div>
              </div>
            </div>
          </StickyContainer>,
          <LoadingPanel active={isLoading} />]
        : <div {...classes('empty-state')}>
            <span>You do not have access rights for this study. Please contact a study lead investigator.</span>
            <Link onClick={goBack}>Go back</Link>
          </div>}
      </div>
      <ModalEditTitle />
      <ModalCreateAnalysis />
      <ModalCreateDocument />
      <ModalAddParticipant />
      <ModalConfirmParticipant />
      <ModalConfirmDatasource />
      <ModalAddDataSource />
    </PageContent>
  );
}

ViewEditStudy.propTypes = {
  studyTitle: PropTypes.string,
  isLoading: PropTypes.bool,
  id: PropTypes.number,
  accessGranted: PropTypes.bool,
  goBack: PropTypes.func,
};

export default ViewEditStudy;
