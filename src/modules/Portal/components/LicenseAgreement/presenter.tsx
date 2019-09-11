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
 * Created: October 3, 2018
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Button } from 'arachne-ui-components';

require('./style.scss');

interface IAboutInfo {
  modal : Object,
  accept: Function,
}

function AboutInfo(props : IAboutInfo) {
  const classes = BEMHelper('license-agreement-modal');
  const { accept } = props;

  return (
    <Modal
      modal={props.modal}
      title="License Agreement"
      mods={['no-padding']}
      onBeforeClose={() => false}
    >
      <div {...classes()}>
        <p {...classes('line')}>In order to use the SNOMED International SNOMED CT Browser and HemOnc, please accept the following license agreement:</p>
        <h1 {...classes('title')}>SNOMED INTERNATIONAL SNOMED CT LICENSE AGREEMENT</h1>
        <p {...classes('line')}>
          <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> includes SNOMED Clinical Terms® (SNOMED CT®) which is used by permission of the
          SNOMED International. All rights reserved. SNOMED CT® was originally created by
          the College of American Pathologists.
          <br />
          “SNOMED”, “SNOMED CT” and “SNOMED Clinical Terms” are registered
          trademarks of the SNOMED International (<a href="http://www.snomed.org">www.snomed.org</a>)
        </p>
        <div {...classes('line')}>
          Use of SNOMED CT in <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> is governed by the conditions of the following SNOMED CT license issued by
            SNOMED International:
        <ol {...classes('list')}>
          <li>The meaning of the terms “Affiliate”, or “Data Analysis System”, “Data
            Creation System”, “Derivative”, “End User”, “Extension”, “Member”, “Non-Member
            Territory”, “SNOMED CT” and “SNOMED CT Content” are as defined in the SNOMED
            International Affiliate License Agreement (see <a href="http://www.snomed.org/resource/resource/117">on the SNOMED International web site</a>).
          </li>
          <li>
            Information about Affiliate Licensing is available at
              <a href="http://www.snomed.org/snomed-ct/get-snomed-ct">http://www.snomed.org/snomed-ct/get-snomed-ct</a>. Individuals or organizations wishing to register as SNOMED International
              Affiliates can register at <a href="https://mlds.ihtsdotools.org">mlds.ihtsdotools.org</a>, subject to acceptance of the Affiliate License Agreement (see <a href="http://www.snomed.org/resource/resource/117">on the SNOMED International web site)</a>.
          </li>
          <li>
            The current list of SNOMED International Member Territories can be viewed at <a href="http://www.snomed.org/members">www.snomed.org/members</a>. Countries not included in that list are "Non-Member Territories".
          </li>
          <li>
            End Users, that do not hold an SNOMED International Affiliate License, may
              access SNOMED CT® using <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> subject to acceptance of and adherence to the following sub-license limitations:
          <ol {...classes('sublist')}>
            <li>
              The sub-licensee is only permitted to access SNOMED CT® using this
              software (or service) for the purpose of exploring and evaluating the
              terminology.
            </li>
            <li>
              The sub-licensee is not permitted the use of this software as part of a
              system that constitutes a SNOMED CT "Data Creation System" or "Data Analysis
              System", as defined in the SNOMED International Affiliate License. This means
              that the sub-licensee must not use <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> to add or copy SNOMED CT identifiers into any type of record system, database or
              document.
            </li>
            <li>The sub-licensee is not permitted to translate or modify SNOMED CT Content
              or Derivatives.
            </li>
            <li>The sub-licensee is not permitted to distribute or share SNOMED CT Content
              or Derivatives.
            </li>
          </ol>
        </li>
        <li>
          SNOMED International Affiliates may use <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> as part of a "Data Creation System" or "Data Analysis System" subject to the
          following conditions:
          <ol {...classes('sublist')}>
            <li>
              The SNOMED International Affiliate, using <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span>
              must accept full responsibility for any reporting and fees due for use or
              deployment of such a system in a Non-Member Territory.
            </li>
            <li>The SNOMED International Affiliate must not use
              <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> to access or interact with SNOMED CT in any way that is not permitted by the
              Affiliate License Agreement.
            </li>
            <li>
              In the event of termination of the Affiliate License Agreement, the use of
              <span {...classes('strong')}>SNOMED International SNOMED CT Browser</span> will be subject to the End User limitations noted in 4.
            </li>
          </ol>
        </li>
      </ol>
      </div>
        <h1 {...classes('title')}>HemOnc license agreement</h1>
        <div {...classes('line')}>
          The HemOnc Vocabulary is a derivative product of HemOnc.org, which is wholly owned and operated by HemOnc.org LLC. Use of the HemOnc Vocabulary is governed by the conditions of this License Agreement issued by HemOnc.org LLC:
          <ol {...classes('list')}>
            <li>
              The meaning of the terms “Data Analysis System”, “Data Creation System”, and “License” is defined below.
            </li>
            <li>
              If you are already holding a HemOnc ontology License, you are subject to the terms and conditions of the License for the version of the HemOnc Vocabulary which was provided to you. If you wish to obtain this version of the HemOnc Vocabulary, you are subject to the following limitations.
            </li>
            <li>
              If you currently do not hold a HemOnc ontology License, you may access the HemOnc Vocabulary subject to acceptance of and adherence to the following limitations:

              <ol {...classes('sublist')}>
                <li>
                  You are permitted to access HemOnc using this software for the purpose of exploring and evaluating the terminology.
                </li>
                <li>
                  You are permitted to use HemOnc as part of a system that constitutes a Data Analysis System, as defined below.
                </li>
                <li>
                  You are not permitted the use of HemOnc as part of a system that constitutes a Data Creation System, as defined  below. This means that you must not use HemOnc identifiers in any type of system intended for direct or indirect patient care.
                </li>
                <li>
                  If you share the Licensed Material with a third party, attribution of the HemOnc vocabulary must be given to HemOnc.org LLC, with a URI or hyperlink to HemOnc.org provided if reasonably possible. Use of HemOnc by a third party would be limited to a Data Analysis System and a copy of this License Agreement must be supplied to the third party.
                </li>
                <li>
                  You may not use HemOnc as a substitute for formal medical training, substitute it for independent clinical judgment, and construe it as offering medical advice.
                </li>
              </ol>
            </li>
          </ol>
        </div>
        <p {...classes('line')}>
          If you wish to utilize the vocabulary for purposes other than specified here, contact us by emailing <a href="mailto:licensing@hemonc.org">licensing@hemonc.org</a>.
        </p>
        <p {...classes('line')}>
          You agree to indemnify and hold HemOnc.org LLC and all parties who have contributed to HemOnc.org and this derivative product harmless from and against all claims, liability, losses, damages, costs, and expenses, including--but not limited to--legal fees
        </p>
        <p {...classes('line')}>Definitions</p>
        <p {...classes('line')}>
          Data Analysis System: a computer system that is used to analyze records or other data, but not if that system is also a Data Creation System
        </p>
        <p {...classes('line')}>
          Data Creation System: a computer system that is used to create records or other data that is encoded using HemOnc, for the purposes of facilitating patient care
        </p>
        <p {...classes('line')}>
          License: the separate <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license to the full HemOnc ontology
        </p>
      </div>
    <div {...classes('actions')}>
      <Button mods={['rounded', 'success']} onClick={accept}>Accept</Button>
    </div>
    </Modal>
  );
}

export default AboutInfo;
