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

require('./style.scss');

interface ITermStateProps {
  connections: any;
  details: any;
  isLoading: boolean;
  name: string;
  termId: number;
};

interface ITermDispatchProps {
  fetch: (termId: number) => (dispatch: Function) => any;
  goBack: () => NavigateAction;
};

interface ITermProps extends ITermStateProps, ITermDispatchProps {

};

function Term(props: ITermProps) {
  const {
    connections,
    details,
    goBack,
    isLoading,
    name,
  } = props;
  const classes = BEMHelper('term');

  return (    
    <div {...classes()}>
      <div {...classes({ element: 'subheader', extra: 'row' })}>
        <Link onClick={goBack} {...classes('back-button')}>keyboard_backspace</Link>
        <span>{name}</span>
      </div>
      <div className='row'>
        <Panel
          {...classes({ element: 'details-wrapper', extra: 'col-xs-12 col-md-4' })}
          title='Details'
        >
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
        {/* <Panel
          {...classes({ element: 'connections-wrapper', extra: 'col-xs-12 col-md-7'})}
          title='Term connections'
         >
          
        </Panel> */}
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
