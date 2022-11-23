import { combineReducers, configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../reducers/tasksReducer';

const reducer = combineReducers({
	tasks: tasksReducer,
});

export const store = (() => {
	return configureStore({
		reducer,
	});
})();
