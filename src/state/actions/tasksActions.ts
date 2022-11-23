import { SET_ACTIVE_STATUS, SET_MOCK_DATA, SET_TASKS } from './actionTypes';
import { IDataResponse } from '../../interface/interface';

export function setTasks(payload: IDataResponse) {
	return { type: SET_TASKS, payload };
}

export function setActiveStatusById(payload: number) {
	return { type: SET_ACTIVE_STATUS, payload };
}

export function setMockTasks(payload: IDataResponse) {
	return { type: SET_MOCK_DATA, payload };
}
