import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { FormInput, Checkbox, Button } from 'arachne-components';
import { reduxForm, Field } from 'redux-form';
import { FormEventHandler } from "react";
require('./style.scss');

interface IFiltersPanelStateProps {
  initialValues: any,
}

interface IFiltersPanelDispatchProps {
  fetchRelations: Function,
  fetchRelationships: Function,
  setTermFilters: Function,
  handleSubmit: Function,
}

interface IFiltersPanelProps extends IFiltersPanelStateProps, IFiltersPanelDispatchProps {
  doFilter: Function,
  termId: number,
}

function StandardsOnly({options, input}) {
  const classes = BEMHelper('standards-only');

  return (
    <Checkbox
      {...classes()}
      isChecked={input.value}
      onChange={input.onChange}
    />
  );
}

function NumberOfLevels({options, input}) {
  const classes = BEMHelper('levels');

  return (
    <input
      {...classes({modifiers: 'input'})}
      type="number"
      min="1"
      value={input.value}
      onChange={input.onChange}
    />
  );
}

function FiltersPanel(props: IFiltersPanelProps) {
  const classes = BEMHelper('filters-panel');
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit(props.doFilter)}>
      <div {...classes()}>
        <div {...classes('item')}>
          <span {...classes('levels-label')}>Number of parent levels</span>
          <Field
            component={NumberOfLevels}
            name="levels"
            options={{}}
          />
        </div>
        <Button {...classes('btn')}
                mods={['success']}
                type="submit"
                ico="done">done</Button>
        <div {...classes('item')}>
          <span {...classes('standards-label')}>Standard concepts</span>
          <Field
            component={StandardsOnly}
            name="standardsOnly"
          />
        </div>
      </div>
    </form>
  );
}

export default FiltersPanel;

export {
  IFiltersPanelProps,
  IFiltersPanelDispatchProps,
  IFiltersPanelStateProps,
};