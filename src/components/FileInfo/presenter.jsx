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
 * Created: May 11, 2017
 *
 */

import React from 'react';
import moment from 'moment-timezone';
import BEMHelper from 'services/BemHelper';
import { Link } from 'arachne-ui-components';
import { shortDate as dateFormat } from 'const/formats';

require('./style.scss');

function FileInfo(props) {
  const classes = new BEMHelper('code-file-info');
  const {
    author,
    createdAt,
    docType,
    link,
    linkTarget,
    label,
    version,
    subtitle,
    horizontal,
  } = props;

  return (
    <div {...classes({ modifiers: { horizontal } })}>
      <div {...classes('main-container')}>
        <i {...classes('ico', docType)} />
        <span {...classes('main-info')} title={label}>
          {link
            ? <Link {...classes('name')} to={link} target={linkTarget}>
              {label}
            </Link>
            : <span>{label}</span>
          }
          {createdAt &&
            <span {...classes('datetime')}>
              {moment(createdAt).tz(moment.tz.guess()).format(dateFormat)}
            </span>
          }
          {subtitle}
        </span>
      </div>
      {version &&
        <div {...classes('version-container')}>
          V{version}
        </div>
      }
      {author && author.id &&
        <div {...classes('author-container')}>
            <Link {...classes('author')} to={author.link} target={linkTarget}>
              {author.firstname} {author.middlename
                ? `${author.middlename.substr(0, 1)}.`
                : ''} {author.lastname}
            </Link>
        </div>
      }
    </div>
  );
}

export default FileInfo;
