import * as React from "react";
import BEMHelper from "services/BemHelper";
import { Button, Checkbox, Select } from "arachne-components";
import { Field } from "redux-form";
import { push } from "react-router-redux";
import { debounce } from 'lodash';
import { defaultLevels, zoomLevels } from "modules/SearchTerms/const";
require('./style.scss');

interface IFiltersPanelStateProps {
  initialValues: any,
  path: any,
  zoomLevel: number;
  levels: number;
}

interface IFiltersPanelDispatchProps {
  filter: (address: string) => typeof push;
}

interface IFiltersPanelProps extends IFiltersPanelStateProps, IFiltersPanelDispatchProps {
  doFilter: (param: { levels?: string, zoomLevel?: string }) => typeof push;
  termId: number;
}

function NumberOfLevels({ options, input }) {
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
      value={parseInt(input.value, 0)}
    />
  );
}

function ZoomLevel({ options, input }) {
  const classes = BEMHelper('zoom-levels');

  return (
    <Select {...classes()}
      options={zoomLevels}
      onChange={(val) => {
          input.onChange(val);
          // will use the previous state
          options.doFilter({
            zoomLevel: val,
          });
        }
      }
      value={parseInt(input.value, 0)}
    />
  );
}

function FiltersPanel(props: IFiltersPanelProps) {
  const classes = BEMHelper('filters-panel');
  const { doFilter, zoomLevel } = props;

  return (
    <div {...classes()}>
      <div {...classes('item')}>
        <span {...classes('select-label')}>Level of details</span>
        <Field
          component={ZoomLevel}
          name="zoomLevel"
          options={{
            doFilter,
          }}
        />
      </div>
      {zoomLevel === 4 &&
        <div {...classes('item')}>
          <span {...classes('select-label')}>Number of parent levels</span>
          <Field
            component={NumberOfLevels}
            name="levels"
            options={{
              doFilter,
            }}
          />
        </div>
      }
    </div>
  );
}

export default FiltersPanel;

export {
  IFiltersPanelProps,
  IFiltersPanelDispatchProps,
  IFiltersPanelStateProps,
};