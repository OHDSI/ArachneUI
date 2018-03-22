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
  modal: Object,
}

function AboutInfo(props: IAboutInfo) {
  const classes = BEMHelper('about-info-modal');
  const {
    buildNumber,
    isLoading,
    projectVersion,
    buildId,
  } = props;

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
          @ 2015-2017, Odysseus Data Services, Inc. All rights reserved
        </p>
        {projectVersion && buildNumber &&
          <p {...classes('line', ['additional', 'padded'])}>
            Version { projectVersion }.{ buildNumber }.{ buildId }
          </p>
        }
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
