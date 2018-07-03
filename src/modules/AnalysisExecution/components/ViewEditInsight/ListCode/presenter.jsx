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
 * Created: May 05, 2017
 *
 */

import React from 'react';
import { Pagination } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import FileInfo from 'components/FileInfo';

require('./style.scss');

function ListCode({ files, onSelect, pageCount, currentPage, pageKey, path }) {
  const classes = new BEMHelper('insight-list-code');

  return (
    <div {...classes()}>
      <ul>
        {files.map(item =>
          <li
            {...classes({ element: 'item', modifiers: { selected: item.isSelected } })}
            onClick={ () => onSelect(item) }
          >
            <FileInfo {...item} />
            <div {...classes('chat')}>
              <i
                {...classes({ element: 'chat-ico', modifiers: { active: item.commentCount } })}
              >
                chat_bubble
              </i>
              <span {...classes('chat-message-cnt')}>{ item.commentCount || 0 }</span>
            </div>
          </li>
        )}
        {!files.length &&
          <li
            {...classes('item')}
          >
            There are no files in this view
          </li>
        }
      </ul>
      {files.length !== 0 &&
        <div {...classes('pagination')}>
          <Pagination
            pages={pageCount}
            currentPage={currentPage}
            pageKey={pageKey}
            path={path}
            showArrows={false}
          />
        </div>
      }
    </div>
  );
}

export default ListCode;
