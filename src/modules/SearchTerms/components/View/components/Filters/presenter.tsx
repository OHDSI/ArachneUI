import * as React from "react";
import BEMHelper from "services/BemHelper";
import { Button, Checkbox } from "arachne-components";
import { Field } from "redux-form";
import { push } from "react-router-redux";
require('./style.scss');

interface IFiltersPanelStateProps {
  initialValues: any,
  location: any,
}

interface IFiltersPanelDispatchProps {
  fetchRelations: Function;
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
  let t;
  return (
    <Checkbox
      {...classes()}
      isChecked={input.value}
      onChange={(val) => {
        input.onChange(val);
        clearTimeout(t);
        t = setTimeout(() => options.handleSubmit(val), 100);
      }}
    />
  );
}

function NumberOfLevels({options, input}) {
  const classes = BEMHelper('levels');

  return (
    <div {...classes({modifiers: 'pane'})}>
      <input
        {...classes({modifiers: 'input'})}
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
        <div {...classes('item')}>
          <span {...classes('standards-label')}>Standard concepts</span>
          <Field
            component={StandardsOnly}
            name="standardsOnly"
            options={{handleSubmit: handleSubmit(doFilter)}}
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