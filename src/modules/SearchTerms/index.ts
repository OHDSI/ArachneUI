import rootRoute from './routes';

export default {
  rootRoute,
	actions: () => require('./actions').default,
	reducer: () => require('./reducers').default,
};
