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
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Vocabulary/const';
import { get } from 'lodash';
import ModalDownloadResult from './presenter';

function mapStateToProps(state: any) {
  
	return {    
  };
}

const mapDispatchToProps = {
  close: () => ModalUtils.actions.toggle(modal.downloadResult, false),
};

const ReduxModalWindow = ModalUtils.connect({ name: modal.downloadResult })(ModalDownloadResult);

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps
)
(ReduxModalWindow);
