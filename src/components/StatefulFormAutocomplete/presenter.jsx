/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin
 * Created: June 26, 2018
 *
 */

import React, { Component } from 'react';
import { FormAutocomplete } from 'arachne-ui-components';


export default class StatefulFormAutocomplete extends Component {

  constructor() {
    super();
    this.storeSelectedOption = this.storeSelectedOption.bind(this);
    this.state = {
      selectedOption: null,
    }
  }
  
  storeSelectedOption(option) {
    this.setState({
      selectedOption: option,
    })
  }

  render() {
    const input = {
      ...this.props.input,
      onChange: (option) => {
        (this.props.storeSelectedOption || this.storeSelectedOption)(this.props.options.find(o => o.value === option));
        return this.props.input.onChange(option);
      }
    };

    return <FormAutocomplete
      {...this.props}
      options={!!this.state.selectedOption ? [ ...this.props.options, this.state.selectedOption ] : this.props.options }
      input={input}
    />;
  }
}