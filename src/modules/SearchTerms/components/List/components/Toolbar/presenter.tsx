import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Form,
  FormInput,
} from 'arachne-components';

require('./style.scss');

interface IToolbarStateProps {
  initialValues: { [key: string]: object };
}

interface IToolbarProps extends IToolbarStateProps {
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
    <div {...classes({ extra: 'row' })}>
    	<div {...classes({ element: 'title-wrapper', extra: 'col-xs-3 col-md-3' })}>
    		<span {...classes('title')}>Search by keyword</span>
    	</div>
    	<div {...classes({ element: 'search-string', extra: 'col-xs-9 col-md-9' })}>
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
export { IToolbarProps, IToolbarStateProps };
