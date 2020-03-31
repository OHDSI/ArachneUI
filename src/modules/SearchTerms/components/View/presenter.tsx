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
import {
  PageContent,
  Panel,
  LoadingPanel,
  Link,
  ListItem,
  Tabs,
  Button,
} from 'arachne-ui-components';
import { RouterAction } from 'react-router-redux';
import BEMHelper from 'services/BemHelper';
import { get } from 'lodash';
import * as moment from 'moment';
import { commonDateFormat } from 'const/formats';
import TermConnections from './components/Connections';
import TermConnectionsTable from './components/Table';
import TermFiltersPanel from './components/Filters';
import { paths } from 'modules/SearchTerms/const';
import Dropdown from 'react-simple-dropdown';
import { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { isOuterLink } from 'services/Utils';

require('./style.scss');

interface ITermStateProps {
  details: any;
  isLoading: boolean;
  name: string;
  termId: number;
  isTableMode: boolean;
  isStandard: boolean;
  termFilters: any;
  zoomLevel?: number;
  isFullscreen?: boolean;
  termConnections: number;
  hasConnections: boolean;
};

interface ITermDispatchProps {
  fetch: (termId: number) => (dispatch: Function) => any;
  goBack: () => RouterAction;
  fetchConceptAncestors: (termId: number, levels: number, zoomLevel: number) => (dispatch: Function) => any;
  fetchRelationships: (termId: number, standards: boolean) => (dispatch: Function) => any;
  redirect: (address: string) => (dispatch: Function) => any;
  fetchConceptAnyRelations: (termId: number) => (dispatch: Function) => any;
};

interface ITermProps extends ITermStateProps, ITermDispatchProps {
  changeTab: (tab: string) => any;
  toggleFullscreen?: Function;
  goToLicenses: Function;
};

function Term(props: ITermProps) {
  const {
    details,
    goBack,
    isLoading,
    name,
    isTableMode,
    isStandard,
    termId,
    changeTab,
    isFullscreen,
    toggleFullscreen,
    goToLicenses,
    termConnections,
    hasConnections,
  } = props;
  const classes = BEMHelper('term');

  if (!isLoading && get(details, 'accessible') === false) {
    return (
      <div {...classes('empty-state')}>
        <p>You don't have a required license to access this concept. Request a license on the Download page.</p>
        <Button
            {...classes('request-btn')}
            mods={['rounded', 'success']}
            onClick={() => goToLicenses(details.vocabularyIds)}
        >
            Request
        </Button>
      </div>
    );
  }

  let title = 'Term connections';
  if (termConnections) {
    title += ` (${termConnections})`;
  }
  const tabs = [
    {
      label: <span {...classes('tab')}>Hierarchy</span>,
      value: 'graph',
      mods: ['purple'],
    },
    {
      label: <span {...classes('tab')}>Related Concepts</span>,
      value: 'table',
      mods: ['purple'],
    },
  ];
  const synonyms = get(details, 'synonyms', []);
  const validStart = get(details, 'validStart');
  const validEnd = get(details, 'validEnd');
  const invalidReason: string = get(details, 'invalidReason', '');
  const validTerm = get(details, 'validTerm', {
    id: -1,
    name: '',
  });
  const vocabularyReference = get(details, 'vocabularyReference', '');
  const description = <div {...classes('description-body')}>
    <ul {...classes('description-body-wrapper')}>
      <li {...classes('description-line')} title={get(details, 'vocabularyName', '')}>{get(details, 'vocabularyName', '')}</li>
      <li {...classes('description-line')} title={get(details, 'vocabularyVersion', '')}>{get(details, 'vocabularyVersion', '')}</li>
      <li {...classes('description-line')} title={vocabularyReference}>
        {isOuterLink(vocabularyReference)
          ? <Link to={vocabularyReference}>{vocabularyReference}</Link>
          : vocabularyReference
        }
      </li>
    </ul>
  </div>;
  const onlyTable = !isStandard || !hasConnections;

  return (    
    <div {...classes({ modifiers: { fullscreen: isFullscreen } })}>
      <div {...classes({ element: 'subheader-wrapper', extra: 'row' })}>
        <div className="col-xs-12">
          <div {...classes('subheader')}>
            <Link onClick={goBack} {...classes('subheader-back-btn')}>keyboard_backspace</Link>
            <span {...classes('subheader-title')}>{name}</span>
          </div>
        </div>
      </div>
      <div {...classes({ element: 'content', extra: 'row', modifiers: { fullscreen: isFullscreen } })}>
        <div {...classes({
          element: 'details',
          extra: `col-xs-12 col-md-5`,
          modifiers: { fullscreen: isFullscreen }
        })}>
          <Panel title='Details'>
            <ul>
              <ListItem>
                <span {...classes('attribute-name')}>Domain ID</span>
                <span>{get(details, 'domainId', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept Class ID</span>
                <span>{get(details, 'conceptClassId', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Vocabulary ID</span>
                <div {...classes('description')}>
                  <span {...classes('vocid')}>{get(details, 'vocabularyId', '')}</span>
                  {description &&
                    <Dropdown {...classes('description-tooltip')}>
                      <DropdownTrigger
                        {...classes('description-trigger')}
                      >
                        help_outline
                      </DropdownTrigger>
                      <DropdownContent>
                        {description}
                      </DropdownContent>
                    </Dropdown>
                  }
                </div>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept ID</span>
                <span>{get(details, 'id', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept code</span>
                <span>{get(details, 'conceptCode', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Invalid reason</span>
                <span>
                  {invalidReason}
                  {invalidReason !== 'Valid' && get(validTerm, 'id', -1) !== -1 &&
                    <div>
                      Remapped to <Link to={paths.term(validTerm.id)}>{validTerm.name}</Link>
                    </div>
                  }
                </span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Standard concept</span>
                <span>{get(details, 'standardConcept', '')}</span>
              </ListItem>
              {synonyms.length
                ? <ListItem>
                    <span {...classes('attribute-name')}>Synonyms</span>
                    <div>{synonyms.map(synonym => <div>
                      <span>{synonym}</span>
                    </div>)}</div>
                  </ListItem>
                : null
              }
              <ListItem>
                <span {...classes('attribute-name')}>Valid start</span>
                <span>{moment.utc(validStart).format(commonDateFormat)}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Valid end</span>
                <span>{moment.utc(validEnd).format(commonDateFormat)}</span>
              </ListItem>
            </ul>
          </Panel>
        </div>
        <div {...classes({
          element: 'connections-container',
          extra: `col-xs-12 col-md-${isFullscreen? '12' : '7'}`,
          modifiers: { fullscreen: isFullscreen }
        })}>
          <Panel
            {...classes({ element: 'connections-wrapper', modifiers: { stretched: !isStandard || !isTableMode } })}
            title={title}
            headerBtns={() => {
                if (details && !onlyTable) {
                  return <div {...classes('header-buttons')}>
                    <Link
                      onClick={toggleFullscreen}
                      {...classes('fullscreen')}
                    >
                      {`${isFullscreen ? 'fullscreen_exit' : 'fullscreen'}`}
                    </Link>
                    <Tabs
                      options={tabs}
                      onChange={changeTab}
                      value={isTableMode ? tabs[1].value : tabs[0].value}
                    />
                  </div>;
                }
              }
            }
          >
            {isTableMode || onlyTable
              ? <TermConnectionsTable />
              : [<TermFiltersPanel termId={termId} key="1" />, <TermConnections key="2" />]
            }
          </Panel>
        </div>
      </div>
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Term;
export {
  ITermProps,
  ITermStateProps,
  ITermDispatchProps,
};
