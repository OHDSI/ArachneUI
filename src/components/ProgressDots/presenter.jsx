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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: July 03, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function ProgressDots({ totalSteps, step, backBtn, nextBtn }) {
  const classes = new BEMHelper('progress-dots');

	return (
		<div {...classes()}>
			{backBtn &&
				<div {...classes('back')}>
					{backBtn}
				</div>
			}
			<ul {...classes('list')}>
				{Array(totalSteps).fill(0).map((dummy, i) => 
					<li {...classes('item', (i + 1) == step ? 'active' : '')} key={i}></li>
				)}
			</ul>
			{nextBtn &&
				<div {...classes('next')}>
					{nextBtn}
				</div>
			}
		</div>
	);
}

export default ProgressDots;
