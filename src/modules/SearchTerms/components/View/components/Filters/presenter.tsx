import * as React from "react";
import BEMHelper from "services/BemHelper";
import { Button, Checkbox, Select } from "arachne-components";
import { Field } from "redux-form";
import { push } from "react-router-redux";
import { debounce } from 'lodash';
import { defaultLevels } from "modules/SearchTerms/const";
require('./style.scss');

interface IFiltersPanelStateProps {
  initialValues: any,
  currentValues: {
    levels: number;
    standardsOnly: boolean;
  };
}

interface IFiltersPanelDispatchProps {
  fetchConceptAncestors: Function;
  fetchRelationships: Function;
  filter: (address: string) => typeof push;
}

interface IFiltersPanelProps extends IFiltersPanelStateProps, IFiltersPanelDispatchProps {
  doFilter: (param: { string }) => typeof push;
  termId: number;
  isTableMode: boolean;
}

function StandardsOnly({options, input}) {
  const classes = BEMHelper('standards-only');
  return (
    <Checkbox
      {...classes()}
      isChecked={input.value}
      onChange={(val) => {
        input.onChange(val);
        // will use the previous state
        options.doFilter({
          standardsOnly: !input.value,
        });
      }}
    />
  );
}

function NumberOfLevels({options, input}) {
  const classes = BEMHelper('levels');
  const conceptLayers = [];
  for (let i=1; i <= defaultLevels; i++) {
    conceptLayers.push({
      value: i,
      label: i,
    });
  }

  return (
    <Select {...classes()}
      options={conceptLayers}
      onChange={(val) => {
          input.onChange(val);
          // will use the previous state
          options.doFilter({
            levels: val,
          });
        }
      }
      // initially value is string (taken from url)
      value={parseInt(input.value, 0)}
    />
  );
}

function FiltersPanel(props: IFiltersPanelProps) {
  const classes = BEMHelper('filters-panel');
  const { doFilter } = props;

  return (
    <div {...classes()}>        
      {/*
        <div {...classes('item')}>
          <span {...classes('standards-label')}>Standard concepts</span>
          <Field
            component={StandardsOnly}
            name="standardsOnly"
            options={{
              doFilter,
            }}
          />
        </div>
      */}
      <div {...classes('item')}>
        <span {...classes('levels-label')}>Number of parent levels</span>
        <Field
          component={NumberOfLevels}
          name="levels"
          options={{
            doFilter,
          }}
        />
      </div>
    </div>
  );
}

export default FiltersPanel;

export {
  IFiltersPanelProps,
  IFiltersPanelDispatchProps,
  IFiltersPanelStateProps,
};