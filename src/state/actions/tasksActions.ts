import { SET_ACTIVE_STATUS, SET_TASKS } from './actionTypes';
import { IDataResponse } from '../../interface/interface';

export function setTasks(payload: IDataResponse) {
	return { type: SET_TASKS, payload };
}

export function setActiveStatusById(payload: number) {
	return { type: SET_ACTIVE_STATUS, payload };
}
