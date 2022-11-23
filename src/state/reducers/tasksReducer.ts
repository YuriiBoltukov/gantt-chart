import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { IChartResponse, IDataResponse } from '../../interface/interface';
import { createMatcher, setActiveStatusById } from '../services/tasksService';
import { SET_TASKS, SET_ACTIVE_STATUS } from '../actions/actionTypes';
import { clone } from 'ramda';

export interface ITaskMatcher {
	[id: number]: IChartResponse;
}
export interface TasksState {
	taskList: IDataResponse | null;
	taskMatcher: ITaskMatcher | null;
}

const initialState: TasksState = {
	taskList: null,
	taskMatcher: null,
};

export default function tasksReducer(
	state = initialState,
	action: any
): TasksState {
	switch (action?.type) {
		case SET_TASKS:
			const matcher: ITaskMatcher = createMatcher(action.payload.chart);

			return {
				taskMatcher: matcher,
				taskList: action.payload,
			};
		case SET_ACTIVE_STATUS:
			if (!state.taskList) return state;

			const stateNew = clone(state.taskList);

			stateNew.chart = setActiveStatusById(stateNew.chart, action.payload);

			return {
				...state,
				taskList: stateNew,
			};
		default:
			return state;
	}
}
