/**
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
 * Created: January 27, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import { paths } from 'modules/ExpertFinder/const';

require('./style.scss');

function InviteModal(props) {
  const {
    modal,
    study,
    user,
  } = props;
  const classes = new BEMHelper('invite-confirm-modal');

  return (
    <Modal {...classes()} modal={modal} title="Confirmation">
      Your invite has been sent to <Link to={paths.profile(user.id)}>{user.name}</Link> for <Link to={paths.study(study.value)}>{study.label}</Link>
    </Modal>);
}

InviteModal.propTypes = {
};

export default InviteModal;
