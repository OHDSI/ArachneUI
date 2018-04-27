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
 * Created: January 16, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';

import { Button } from 'arachne-ui-components';
import { LoadingPanel } from 'arachne-ui-components';
import { PageContent } from 'arachne-ui-components';

import Info from './Info/index';
import ContactInfo from './ContactInfo/index';
import Links from './Links/index';
import Publications from './Publications/index';
import Skills from './Skills/index';
import Summary from './Summary/index';
import { Toolbar } from 'arachne-ui-components';
import UserPic from './UserPic/index';
import UserPicModal from './UserPicModal';
import NameEditModal from './NameEditModal';
import InviteModal from 'modules/ExpertFinder/components/InviteModal';
import InviteConfirmModal from 'modules/ExpertFinder/components/InviteConfirmModal';
import { cancelBtnConfig } from 'modules/ExpertFinder/const';

require('./style.scss');

function ProfileView(props) {
  const classes = new BEMHelper('profile-view');
  const {
    goBack,
    name,
  } = props;

  const caption = <div {...classes('toolbar')}>
    <Button onClick={goBack} {...classes('back')}>
      <i {...classes('back-icon')}>
        arrow_back
      </i>
    </Button>
    <span {...classes('user-name')}>{name}</span>
    {props.editable &&
      <Button {...classes('edit-button')} onClick={props.showNameEditDialog}>mode_edit</Button>
    }
  </div>;

  return (
    <PageContent title={`${name} | Arachne`}>
      <div {...classes()}>
        <Toolbar
          caption={caption}
        />
        <div {...classes('content')}>
          <div className="row">
            <div className="col-xs-2 col-lg-2 col-xl-2">
              <div className="row">
                <div className="col-xs-12">
                  <UserPic/>
                  {!props.editable &&
                    <Button
                      {...classes('invite-button')}
                      mods={['success', 'rounded']}
                      onClick={props.invite}
                      >
                        Invite
                      </Button>
                  }
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-lg-5">
              <div {...classes('card', 'uncut')}>
                <Info/>
              </div>
              <div {...classes('card', 'uncut')}>
                <ContactInfo/>
              </div>
              <div {...classes('card', 'shadowed')}>
                <Summary/>
              </div>
              <div {...classes('card', 'uncut')}>
                <Skills/>
              </div>
            </div>
            <div className="col-xs-12 col-lg-5">
              <div {...classes('card', 'shadowed')}>
                <Publications/>
              </div>
              <div {...classes('card', 'shadowed')}>
                <Links/>
              </div>
            </div>
          </div>
        </div>
        {props.editable &&
        <div>
          <UserPicModal />
          <NameEditModal />
        </div>
        }
        <InviteModal />
        <InviteConfirmModal />
        <LoadingPanel active={props.isLoading} />   
      </div>
    </PageContent>
  );
}

ProfileView.PropTypes = {
  general: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    professionalType: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  }),
  personalSummary: PropTypes.string,
  skills: PropTypes.array,
  publications: PropTypes.array,
  links: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default ProfileView;
