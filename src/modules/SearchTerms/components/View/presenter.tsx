import * as React from 'react';
import {
  PageContent,
  Panel,
  LoadingPanel,
  Link,
  ListItem,
} from 'arachne-components';
import { NavigateAction } from 'react-router-redux';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/SearchTerms/const';
import { get } from 'lodash';
import TermConnections from './components/Connections';

require('./style.scss');

interface ITermStateProps {
  details: any;
  isLoading: boolean;
  name: string;
  termId: number;
};

interface ITermDispatchProps {
  fetch: (termId: number) => (dispatch: Function) => any;
  goBack: () => NavigateAction;
  fetchRelations: (termId: number) => (dispatch: Function) => any;
};

interface ITermProps extends ITermStateProps, ITermDispatchProps {

};

function Term(props: ITermProps) {
  const {
    details,
    goBack,
    isLoading,
    name,
  } = props;
  const classes = BEMHelper('term');

  return (    
    <div {...classes()}>
      <div {...classes({ element: 'subheader-wrapper', extra: 'row' })}>
        <div className="col-xs-12">
          <div {...classes('subheader')}>
            <Link onClick={goBack} {...classes('subheader-back-btn')}>keyboard_backspace</Link>
            <span {...classes('subheader-title')}>{name}</span>
          </div>
        </div>
      </div>
      <div {...classes({ element: 'content', extra: 'row' })}>
        <div className="col-xs-12 col-md-5">
          <Panel title='Details'>
            <ul>
              <ListItem>
                <span {...classes('attribute-name')}>Domain ID</span>
                <span>{get(details, 'domain.id', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Concept Class ID</span>
                <span>{get(details, 'conceptClassId', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Vocabulary ID</span>
                <span>{get(details, 'vocabulary.id', '')}</span>
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
                <span>{get(details, 'invalidReason', '')}</span>
              </ListItem>
              <ListItem>
                <span {...classes('attribute-name')}>Standard concept</span>
                <span>{get(details, 'standardConcept', '')}</span>
              </ListItem>
            </ul>
          </Panel>
        </div>
        <div className="col-xs-12 col-md-7">
          <Panel
            {...classes({ element: 'connections-wrapper' })}
            title='Term connections'
          >
            <TermConnections />
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
