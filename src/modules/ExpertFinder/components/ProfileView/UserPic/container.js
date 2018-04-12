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

import { ModalUtils } from 'arachne-ui-components';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { modal, apiPaths } from 'modules/ExpertFinder/const';
import UserPic from './presenter';

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const editable = get(moduleState, 'data.result.isEditable', false);
  const id = get(moduleState, 'data.result.id', 1);
  const hash = get(moduleState, 'data.result.updated', '');

  return {
    userpic: apiPaths.userpic({ id, hash }),
    editable,
  };
}
const mapDispatchToProps = {
  showUploadForm: () => ModalUtils.actions.toggle(modal.userPic, true),
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPic);
