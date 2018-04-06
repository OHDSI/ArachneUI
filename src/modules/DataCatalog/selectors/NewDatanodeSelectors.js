/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Created: April 02, 2018
 *
 */
import { get } from 'services/Utils';

class NewDatanodeSelectors {

  getDataNodes(state) {
    const dataNodes = get(state, 'dataCatalog.dataNode.queryResult', [], 'Array');
    const tempDataNode = get(state, 'dataCatalog.dataNode.tempData');

    return [...dataNodes, tempDataNode].filter(val => val);;
  }

  getDataNodeOptions(state) {
    return this.getDataNodes(state).map(node => ({
      value: node.centralId,
      label: node.name,
    }));
  }

  getOrganizations(state) {
    const orgs = get(state, 'dataCatalog.organization.queryResult', [], 'Array');
    const tempOrg = get(state, 'dataCatalog.organization.tempData');

    return [...orgs, tempOrg].filter(val => val);
  }

  getOrganizationOptions(state) {
    return this.getOrganizations(state).map(org => ({
      value: org.id,
      label: org.name,
    }));
  }

  build() {
    return {
      getDataNodes: this.getDataNodes,
      getDataNodeOptions: this.getDataNodeOptions,
      getOrganizations: this.getOrganizations,
      getOrganizationOptions: this.getOrganizationOptions,
    };
  }

}

export default NewDatanodeSelectors;
