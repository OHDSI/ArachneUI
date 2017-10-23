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
 * Created: February 20, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { BadgedIcon } from 'arachne-ui-components';
import { Modal } from 'arachne-ui-components';
import { LoadingPanel } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';

import { paths, images } from 'modules/Portal/const';

require('./style.scss');

function AboutInfo(props) {
  const classes = new BEMHelper('about-info-modal');
  const {
    buildNumber,
    isLoading,
    projectVersion,
    buildId,
  } = props;

  return (
    <Modal modal={props.modal} title="Arachne Collaboration Network">
      <div {...classes()}>
        <Link {...classes('link')} to={paths.odysseus()}>
          <img
            {...classes('logo')}
            src={images.logo}
            alt="Odysseus Data Services, Inc. logo"
            title="Odysseus Data Services, Inc."
          />
        </Link>
        <p {...classes('line', 'emphasized')}>
          @ 2015-2017, Odysseus Data Services, Inc. All rights reserved
        </p>
        {projectVersion && buildNumber &&
          <p {...classes('line', 'additional')}>
            Version { projectVersion }.{ buildNumber }.{ buildId }
          </p>
        }
        <LoadingPanel active={isLoading}/>
      </div>
    </Modal>
  );
}

AboutInfo.propTypes = {
};

export default AboutInfo;
