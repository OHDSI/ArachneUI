/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: February 14, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import { LoadingPanel } from 'arachne-ui-components';
import { paths, statusColors } from 'modules/AnalysisExecution/const';

require('./style.scss');

function StatusListItem({ status }) {
	const classes = new BEMHelper('modal-status-history');
  const modifiers = status.value ? statusColors[status.value] : null;
	return (
		<tr>
			<td {...classes('date')}>
				{status.date}
			</td>
			{status.comment === null
				? <td {...classes({ element: 'status', modifiers })}>
						{status.title}
					</td>
				: <td
						{...classes({ element: 'status', modifiers })}
					>
							{status.title}
							<div
								{...classes({ element: 'comment', extra: 'ac-tooltip' })}
								aria-label={`Comment: ${status.comment}`}
								data-tootik-conf='bottom multiline'
							>
								<span
									{...classes('comment-ico')}
								>comment</span>
							</div>
					</td>
			}
			<td {...classes('author')}>
				{status.author.id ?
				<Link to={paths.profile(status.author.id)}>
					{status.author.firstname} {status.author.lastname}
				</Link>
				:
					<span>{status.author.firstname} {status.author.lastname}</span>
				}
			</td>
		</tr>
	);
}

function ModalStatusHistory({
	modal,
	listStatuses,
	isLoading,
}) {
  const classes = new BEMHelper('modal-status-history');

  return (
    <Modal modal={modal} title="Status history">
      <table {...classes()}>
      	{listStatuses && listStatuses.map((status, key) =>
      		<StatusListItem status={status} key={key} />
				)}
      </table>
      <LoadingPanel active={isLoading} />
    </Modal>
  );
}

export default ModalStatusHistory;
