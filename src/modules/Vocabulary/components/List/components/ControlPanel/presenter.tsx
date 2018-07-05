/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Select,
  Link,
} from 'arachne-ui-components';
import { paths } from 'modules/Vocabulary/const';
import { Field, FormProps } from 'redux-form';

require('./style.scss');

interface IReduxFieldProps {
  options: any;
  input: any;
};

interface IPanelStateProps {
  vocabulariesSelected: boolean,
  initialValues: {
    selection: string;
  }
};

interface IPanelDispatchProps {
  showConfirmation: () => (dispatch: Function) => any;
};

interface IPanelProps extends IPanelStateProps, IPanelDispatchProps {
  download: Function;
};

function selection(props: IReduxFieldProps) {
  const { options, input } = props;
  return (<Select
    className={options.className}
    options={[
      {
        label: 'Show all',
        value: 'all',
      },
      {
        label: 'Show selected',
        value: 'selected',
      },
    ]}
    value={input.value}
    onChange={input.onChange}
    />);
}

function ControlPanel(props: IPanelProps & FormProps<{}, {}, {}>) {
  const {
    download,
    vocabulariesSelected,
  } = props;
  const classes = BEMHelper('vocabulary-control-panel');

  return (
    <div {...classes()}>
      <Field
        component={selection}
        options={{...classes('selection')}}
        name='selection'
      />
      <Link
        {...classes('history-link')}
        to={paths.history()}
      >Show History</Link>
      <Button
        {...classes({ element: 'download-button', modifiers: { disabled: !vocabulariesSelected } })}
        mods={['submit', 'rounded']}
        onClick={download}
        disabled={!vocabulariesSelected}
      >Download vocabularies</Button>
    </div>
    );
}

export default ControlPanel;
export {
  IPanelStateProps,
  IPanelDispatchProps,
  IPanelProps,
};
