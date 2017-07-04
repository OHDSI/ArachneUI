import { combineReducers } from 'redux';
import services from '../apiServices';
import download from './download';

export default combineReducers({
	download,
	vocabularies: services.vocabularies.reducer,
	history: services.history.reducer,
	vocabLicenses: services.vocabLicenses.reducer,
	restore: services.restore.reducer,
});
