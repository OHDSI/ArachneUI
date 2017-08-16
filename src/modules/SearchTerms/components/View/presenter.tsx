import * as React from 'react';
import {
  PageContent,
  Panel,
  LoadingPanel,
  Link,
  ListItem,
  Tabs,
} from 'arachne-components';
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

require('./style.scss');

interface ITermStateProps {
  details: any;
  isLoading: boolean;
  name: string;
  termId: number;
  isTableMode: boolean;
  isStandard: boolean;
  relationshipsCount: number;
  termFilters: any;
  connectionsCount: number;
  zoomLevel?: number;
  isFullscreen?: boolean;
};

interface ITermDispatchProps {
  fetch: (termId: number) => (dispatch: Function) => any;
  goBack: () => RouterAction;
  fetchConceptAncestors: (termId: number, levels: number, zoomLevel: number) => (dispatch: Function) => any;
  fetchRelationships: (termId: number, standards: boolean) => (dispatch: Function) => any;
  redirect: (address: string) => (dispatch: Function) => any;
};

interface ITermProps extends ITermStateProps, ITermDispatchProps {
  changeTab: (tab: string) => any;
  toggleFullscreen?: Function;
};

function Term(props: ITermProps) {
  const {
    details,
    goBack,
    isLoading,
    name,
    isTableMode,
    isStandard,
    relationshipsCount,
    termId,
    changeTab,
    connectionsCount,
    isFullscreen,
    toggleFullscreen,
  } = props;
  const classes = BEMHelper('term');
  let title = 'Term connections';
  if (relationshipsCount) {
    title += ` (${relationshipsCount})`;
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
  const vocabularyReference = get(details, 'vocabularyReference', '')
  const description = <div {...classes('description-body')}>
    <ul {...classes('description-body-wrapper')}>
      <li {...classes('description-line')}>{get(details, 'vocabularyName', '')}</li>
      <li {...classes('description-line')}>{get(details, 'vocabularyVersion', '')}</li>
      <li {...classes('description-line')}>
        <Link to={vocabularyReference}>{vocabularyReference}</Link>
      </li>
    </ul>
  </div>;
  const onlyTable = !isStandard || connectionsCount === 0;

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
              {invalidReason !== 'Valid' && validStart
                ? <ListItem>
                    <span {...classes('attribute-name')}>Valid start</span>
                    <span>{moment(validStart).format(commonDateFormat)}</span>
                  </ListItem>
                : null
              }
              {invalidReason !== 'Valid' && validEnd
                ? <ListItem>
                    <span {...classes('attribute-name')}>Valid end</span>
                    <span>{validEnd}</span>
                  </ListItem>
                : null
              }
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
