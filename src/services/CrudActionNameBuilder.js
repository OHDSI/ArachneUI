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
 * Created: July 19, 2017
 *
 */

class CrudActionNameBuilder {
	constructor(name) {
		this.name = name;
	}

	query() {
		this.name += '_QUERY';
		return this;
	}

	find() {
		this.name += '_FIND';
		return this;
	}

	create() {
		this.name += '_CREATE';
		return this;
	}
	update() {
		this.name += '_UPDATE';
		return this;
	}

	delete() {
		this.name += '_DELETE';
		return this;
	}

	pending() {
		this.name += '_PENDING';
		return this;
	}

	done() {
		this.name += '_FULFILLED';
		return this;
	}

	toString() {
		return this.name;
	}
}

function action(name) {
	return new CrudActionNameBuilder(name);
}

export default CrudActionNameBuilder;
export {
	action,
};
