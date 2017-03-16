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

require('./style.scss');

type DetailAttribute = {
  name: string;
  value: string;
};

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
            {details.map((attribute: DetailAttribute, index: number) =>
              <ListItem key={index}>
                <span {...classes('attribute-name')}>{attribute.name}</span>
                <span>{attribute.value}</span>
              </ListItem>
            )}
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
