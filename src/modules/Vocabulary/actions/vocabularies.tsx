import API from 'services/Api';
import services from '../apiServices';

function load() {
  return services.vocabularies.find();
}

function requestLicense(vocabularyId) {
	return services.vocabLicenses.create({
		vocabularyId,
	});
}

export default {
  load,
  requestLicense,
};
