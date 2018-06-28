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
  * Created: June 26, 2018
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { form } from 'modules/DataCatalog/const';
import CreateDataNodeSelectors from 'modules/DataCatalog/components/DataSource/ViewEdit/Edit/FormCreateDataNode/selectors';

const selectors = (new CreateDataNodeSelectors()).build();

import presenter from './presenter';


/** @augments { Component<any, any> } */
export class EditCommonData extends Component {
  static get propTypes() {
    return {
    };
  } 

  render() {
    return presenter(this.props);
  }
}
 
export default class EditCommonDataBuilder extends ContainerBuilder {
  getComponent() {
    return EditCommonData;
  }
 
  mapStateToProps(state, ownProps) {
    const createdOrganization = selectors.getNewOrganization(state);

    return {
      createdOrganization,
      initialValues: {
        description: ownProps.description,
        organization: get(ownProps, 'organization.id', -1),
      },
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      update: actions.dataCatalog.dataNode.update,
      loadDataNode: actions.dataCatalog.dataNode.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const organization = {
          id: data.organization === -1 ? null : data.organization,
          name: data.organization === -1 ? stateProps.createdOrganization.name : null,
        };
        const dataNode = await dispatchProps.update({ id: ownProps.datanodeId },
          {
            name: ownProps.name,
            description: data.description,
            organization,
          });
        ownProps.setViewMode();
        dispatchProps.loadDataNode({ id: ownProps.datanodeId });

        return dataNode;
      },
    };
  }

}
 
