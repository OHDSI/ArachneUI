import API from 'services/Api';
import services from '../apiServices';

function load() {
  return services.licenses.find();
}

function getUsers(params) {
	return services.users.find({ query: params });
}

function getVocabularies(userId) {
	return services.vocabularies.find({
		query: {
			userId,
		},
	});
}

function remove(vocabId) {
	return services.vocabularies.remove(vocabId);
}

function create(userId, vocabularyV4Ids) {
	return services.licenses.create({
		userId,
		vocabularyV4Ids,
	});
}

export default {
  create,
  getUsers,
  getVocabularies,
  load,
  remove,
};
