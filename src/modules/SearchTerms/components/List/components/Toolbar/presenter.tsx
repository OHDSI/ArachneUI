import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
} from 'arachne-components';

require('./style.scss');

function Toolbar(props: {
  [key: string]: any
}) {
  const classes = BEMHelper('search-toolbar');

  return (
    <div {...classes({ extra: 'row' })}>
    	<div {...classes({ element: 'title-wrapper', extra: 'col-xs-3 col-md-3' })}>
    		<span {...classes('title')}>Search by keyword</span>
    	</div>
    	<div {...classes({ element: 'search-string', extra: 'col-xs-9 col-md-9' })}>
    		<input {...classes('input')} placeholder={'aspirin'} />
        <Button {...classes('search-button')}>search</Button>
    	</div>
    </div>
  );
}

export default Toolbar;
