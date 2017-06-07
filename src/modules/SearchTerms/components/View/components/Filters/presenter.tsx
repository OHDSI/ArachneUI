import * as React from "react";
import BEMHelper from "services/BemHelper";
import { Button, Checkbox } from "arachne-components";
import { Field } from "redux-form";
import { push } from "react-router-redux";
import { debounce } from 'lodash';
require('./style.scss');

interface IFiltersPanelStateProps {
  initialValues: any,
}

interface IFiltersPanelDispatchProps {
  fetchConceptAncestors: Function;
  fetchRelationships: Function;
  handleSubmit: Function;
  filter: (address: string) => typeof push;
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
      onChange={(val) => {
        input.onChange(val);
        options.handleSubmit(val);
      }}
    />
  );
}

function NumberOfLevels({options, input}) {
  const classes = BEMHelper('levels');

  return (
    <div {...classes()}>
      <input
        {...classes('input')}
        type="number"
        min="1"
        value={input.value}
        onChange={input.onChange}
      />
      <Button {...classes('btn')}
              mods={['success']}
              type="submit"
              ico="done">done</Button>
    </div>
  );
}

function FiltersPanel(props: IFiltersPanelProps) {
  const classes = BEMHelper('filters-panel');
  const {handleSubmit, doFilter} = props;

  return (
    <form onSubmit={handleSubmit(doFilter)}>
      <div {...classes()}>
        <div {...classes('item')}>
          <span {...classes('levels-label')}>Number of parent levels</span>
          <Field
            component={NumberOfLevels}
            name="levels"
            options={{}}
          />
        </div>
{/*
        {
          <div {...classes('item')}>
            <span {...classes('standards-label')}>Standard concepts</span>
            <Field
              component={StandardsOnly}
              name="standardsOnly"
              options={{handleSubmit: debounce(handleSubmit(doFilter), 100)}}
            />
          </div>
        }
*/}
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