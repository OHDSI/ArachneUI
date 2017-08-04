import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Form,
  FormInput,
} from 'arachne-components';
import { push } from 'react-router-redux';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { searchParams } from 'modules/SearchTerms/actions/termList';

require('./style.scss');

interface IToolbarStateProps {
  initialValues: { [key: string]: Object };
  locationSearch: locationDescriptor;
  filterParams: searchParams,
}

interface IToolbarDispatchProps {
  search: (address: string) => typeof push;
  updateFacets: (params: searchParams) => (dispatch: Function) => any;
}

interface IToolbarProps extends IToolbarStateProps, IToolbarDispatchProps {
  filter: Function;
}

function Toolbar(props: IToolbarProps) {
  const classes = BEMHelper('search-toolbar');
  const fields = [
    {
      name: 'searchString',
      InputComponent: {
        component: FormInput,
        props: {
          ...classes('input'),
          placeholder: 'aspirin',
        }
      }
    }
  ];
  const submitBtn = {
    label: 'search',
    ...classes('search-button'),
    mods: ['clear'],
  };

  return (
    <div {...classes()}>
    	<div {...classes({ element: 'title-wrapper' })}>
    		<span {...classes('title')}>Search by keyword</span>
    	</div>
    	<div {...classes({ element: 'search-string' })}>
        <Form
          fields={fields}
          onSubmit={props.filter}
          submitBtn={submitBtn}
          actionsClassName={classes('search-button-wrapper').className}
          {...props}
        />
    	</div>
    </div>
  );
}

export default Toolbar;
export { IToolbarProps, IToolbarStateProps, IToolbarDispatchProps };
