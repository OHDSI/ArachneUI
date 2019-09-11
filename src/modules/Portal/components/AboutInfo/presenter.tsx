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

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { BadgedIcon, Modal, LoadingPanel, Link } from 'arachne-ui-components';
import { paths, images } from 'modules/Portal/const';

require('./style.scss');

interface IAboutInfo {
  buildNumber: string,
  isLoading: boolean,
  projectVersion: string,
  buildId: string,
  vocabularyReleaseVersion,
  modal: Object,
}

function AboutInfo(props: IAboutInfo) {
  const classes = BEMHelper('about-info-modal');
  const {
    buildNumber,
    isLoading,
    projectVersion,
    buildId,
    vocabularyReleaseVersion,
  } = props;
  const currentYear = new Date().getFullYear();
  return (
    <Modal modal={props.modal} title="Athena – OHDSI Vocabularies Repository">
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
          @ 2015-{currentYear}, Odysseus Data Services, Inc. All rights reserved
        </p>
        {projectVersion && buildNumber &&
          <p {...classes('line', ['additional', 'padded'])}>
            Version { projectVersion }.{ buildNumber }.{ buildId }
          </p>
        }
        <p {...classes('line', ['additional', 'padded'])}>
          OMOP Vocabulary version: {vocabularyReleaseVersion}
        </p>
        <p {...classes('line', 'padded')}>
          <Link href={'mailto:support@odysseusinc.com'}>support@odysseusinc.com</Link>
        </p>
        <p {...classes('line', 'padded')}>
          <Link href={'https://github.com/OHDSI/Athena'} target={'_blank'}>Github</Link>
        </p>
        <LoadingPanel active={isLoading}/>
      </div>
    </Modal>
  );
}

export default AboutInfo;
