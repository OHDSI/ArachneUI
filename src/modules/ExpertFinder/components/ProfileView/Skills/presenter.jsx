/**
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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: January 16, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';

import { FormExpansible } from 'arachne-ui-components';
import { FormAutocomplete } from 'arachne-ui-components';
import { Panel } from 'arachne-ui-components';
import SkillItem from './SkillItem';
import { submitBtnConfig, cancelBtnConfig } from 'modules/ExpertFinder/const';

require('./style.scss');

function Skills(props) {
  const classes = new BEMHelper('profile-skills-list');
  const skillsDict = [];
  props.skillsDictionary.forEach((skill, index) => {
    if (!props.isCreating) {
      skillsDict.push({
        label: skill.name,
        value: skill.id,
      });
    }
  });

  const formFields = [
    {
      name: 'skill',
	    InputComponent: {
	    	component: FormAutocomplete,
	      props: {
	        placeholder: 'Add Skill (3 letters minimum)',
	        required: true,
          fetchOptions: props.getSkills,
          options: skillsDict,
          canCreateNewOptions: true,
          promptTextCreator: (skill) => `Create skill '${skill}'`,
          onNewOptionClick: (skill) => props.createSkill(skill),
	      },
	    },
	  },
  ];

  return (
    <Panel title="Skills" {...classes()}>
      {props.editable ?
        <div>
          <div {...classes({ element: 'content', modifiers: {empty: !props.items.length} })}> 
            {!props.items.length &&
              <span>No skills yet</span>
            }
            {props.items.map((skill, key) =>
              <SkillItem
                key={key}
                {...skill}
                onRemove={ props.doRemove }
              />
    				)}
          </div>
          <FormExpansible
            fields={formFields}
            addButtonTitle="Add skill"
            formTitle="Add Skill"
            onSubmit={props.doSubmit}
            submitBtnConfig={submitBtnConfig}
            cancelBtnConfig={cancelBtnConfig}
            {...props}
          />
        </div>
        : 
        <div {...classes({ element: 'content', modifiers: {empty: !props.items.length} })}>
          {!props.items.length &&
            <span>No skills yet</span>
          }
          {props.items.map((skill, key) =>
            <p {...classes('skill', 'columned')} key={key}>{skill.name}</p>
          )}
        </div>
      }
    </Panel>
  );
}

Skills.PropTypes = {
  editable: PropTypes.bool,
  items: PropTypes.array.isRequired,
  skillsDictionary: PropTypes.arrayOf({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  isCreating: PropTypes.bool,
};
export default Skills;
