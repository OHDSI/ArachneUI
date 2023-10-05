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
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka,Osmar Benavidez
 * Created: October 03, 2023 
 *
 */

import * as React from "react";
import BEMHelper from "services/BemHelper";
import { Table, Link, TableCellText } from "arachne-ui-components";  
require("./styles/synonymLang.style.scss");

interface SynonymsLang {
  language: string;
  synonyms: string;
}

interface SynonymsLangTableStateProps {
  synonymsLang: Array<SynonymsLang>;
}

interface SynonymsLangTableProps extends SynonymsLangTableStateProps {}

function TableCellLang(langObj: any) {
  const classes = BEMHelper("synonyms-lang-table");
  return (
    <div
      {...classes({
        element: "language-cell",
        modifiers: { empty: !langObj.value },
      })} 
    >
      {langObj.value}
    </div>
  );
}

function TableCellSynonym(langObj: any) {
  const classes = BEMHelper("synonyms-lang-table");
  return (
    <div
       {...classes({
        element: "synonym-cell",
        modifiers: { empty: !langObj.value },
      })} 
    >
      {langObj.value}
    </div>
  );
}

function SynonymsLangTable(props: SynonymsLangTableProps) {
  const { synonymsLang } = props; 
  const classes = BEMHelper("synonyms-lang-table");

  return (
    <div {...classes()}>
      <Table data={synonymsLang} mods={["hover", "padded"]}>
        <TableCellLang header="Language" field="langName" />
        <TableCellSynonym header="Synonym Concept" field="synonymName" />
      </Table>
    </div>
  );
}

export default SynonymsLangTable;

export { SynonymsLang, SynonymsLangTableStateProps, SynonymsLangTableProps };
