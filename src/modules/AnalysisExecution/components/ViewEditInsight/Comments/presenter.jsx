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
import BEMHelper from 'services/BemHelper';
import { Link, LoadingPanel, Panel } from 'arachne-ui-components';
import Comment from 'components/Comment';
import NewComment from './NewComment';

require('./style.scss');

function Comments(props) {
  const classes = new BEMHelper('insight-comments');
  const {
    isLoading,
    isRecentComments,
    commentGroupList,
    loadComments,
    submissionId,
    unloadComments,
    unloadFile,
  } = props;

  const ShowRecent = () => <Link onClick={() => { unloadComments(); unloadFile(); }}>Show all</Link>;
  const commentsExist = commentGroupList && commentGroupList.length;

  return (
    <Panel
    	{...classes()}
    	title={ isRecentComments ? 'Annotations' : 'File Annotations' }
      headerBtns={ isRecentComments ? null : ShowRecent }
    >
      <div
        {...classes({ element: 'wrapper', extra: commentsExist ? 'ac-tooltip' : '' })}
        data-tootik-conf={'top multiline'}
        aria-label={'Code and result files can be annotated individually. Select file on left to add new annotation'}
      >
        {commentsExist ?
          <div>
            {commentGroupList.map(commentGroup =>
              <div>
                <div
                  {...classes('group-name')}
                  onClick={() => loadComments(commentGroup.file)}
                >
                  <span {...classes('group-name-label')}>
                    { commentGroup.file.label || commentGroup.file.name }
                  </span>
                  {isRecentComments &&
                    <span {...classes('group-fake-link')}>
                      Annotate
                    </span>
                  }
                </div>
                <ul>
                  {commentGroup.commentList.map((comment, key) => 
                    <li {...classes('comment')} key={key}>
                      <Comment {...comment} />
                    </li>
                  )}
                </ul>
                {!isRecentComments &&
                  <div  {...classes('new-form')}>
                    <NewComment submissionId={ submissionId } />
                  </div>
                }
              </div>
            )}          
          </div>
          :
          <div {...classes('empty-placeholder')}>
            There are no annotations yet.<br />
            Code and result files can be annotated individually. Select file on left to add new annotation.
          </div>
        }
        <LoadingPanel active={isLoading} />
      </div>
    </Panel>
  );
}

export default Comments;
