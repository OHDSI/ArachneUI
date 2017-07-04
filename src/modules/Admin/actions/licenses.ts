import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/Admin/const';
import { IAppAction } from 'actions';

function getUsers(params: { query: string }) {
	return services.users.find({ query: params });
}

function getAvailableVocabularies(userId) {
	return services.vocabularies.find({
		query: {
			userId,
		},
	});
}

function load() {
  return services.licenses.find();
}

function remove(vocabId: number) {
	return services.licenses.remove(vocabId);
}

function create(userId: number, vocabularyV4Ids: Array<number>) {
	return services.licenses.create({
		userId,
		vocabularyV4Ids,
	});
}

function resolve(id: number, accepted: boolean) {
	return services.licenseAccept.create({
		id,
		accepted,
	});
}

export default {
  create,
  getUsers,
  getAvailableVocabularies,
  load,
  remove,
  resolve,
};
