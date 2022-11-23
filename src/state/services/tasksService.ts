import { host } from '../../environment/environment';
import { IChartResponse, IDataResponse } from '../../interface/interface';
import { clone } from 'ramda';
import { ITaskMatcher } from '../reducers/tasksReducer';

/**
 * For loading tasks from server
 * @returns {Promise<IDataResponse>}
 */
export function getTasks(): Promise<IDataResponse> {
	return fetch(`${host}test.php`)
		.then(responseJson => responseJson.json())
		.then(tasks => tasks && prepareTasks(tasks))
		.catch(error => console.error(error));
}

/**
 * For preparing tasks before to give
 * @param {IDataResponse} tasks
 * @returns {IDataResponse}
 */
function prepareTasks(tasks: IDataResponse): IDataResponse {
	if (tasks.chart) tasks.chart = setActiveStatus(tasks.chart);

	return tasks;
}

/**
 * For setting active status of every charts
 * @param {IChartResponse} chart
 * @returns {IChartResponse}
 */
function setActiveStatus(chart: IChartResponse): IChartResponse {
	if (!chart) return {} as IChartResponse;

	const stackSubTrees: IChartResponse[] = (chart?.sub && [...chart.sub]) || [];

	chart.active = false;

	if (stackSubTrees) {
		while (stackSubTrees.length) {
			const currentTree: IChartResponse =
				stackSubTrees.pop() || ({} as IChartResponse);

			currentTree.active = false;

			if (currentTree?.sub && currentTree?.sub.length) {
				stackSubTrees.push(...currentTree.sub);
			}
		}
	}

	return chart;
}

/**
 * For setting active status of every charts
 * @param {IChartResponse} chart
 * @returns {IChartResponse}
 */
export function setActiveStatusById(
	chartState: IChartResponse,
	id: number
): IChartResponse {
	if (!chartState) return {} as IChartResponse;

	const chart = clone(chartState);

	const stackSubTrees: IChartResponse[] = (chart?.sub && [...chart.sub]) || [];

	if (chart.id === id) {
		chart.active = !chart.active;
		return chart;
	}

	if (stackSubTrees) {
		while (stackSubTrees.length) {
			const currentTree: IChartResponse =
				stackSubTrees.pop() || ({} as IChartResponse);

			if (currentTree.id === id) {
				currentTree.active = !currentTree.active;
				return chart;
			}

			if (currentTree?.sub && currentTree?.sub.length) {
				stackSubTrees.push(...currentTree.sub);
			}
		}
	}

	return chart;
}

/**
 * For creating support matcher
 * @param {IChartResponse} chart
 * @returns {ITaskMatcher}
 */
export function createMatcher(chart: IChartResponse): ITaskMatcher {
	const result: ITaskMatcher = {} as ITaskMatcher;

	if (!chart) return result;

	const stackSubTrees: IChartResponse[] = (chart?.sub && [...chart.sub]) || [];

	result[chart.id] = clone(chart);

	if (stackSubTrees) {
		while (stackSubTrees.length) {
			const currentTree: IChartResponse =
				stackSubTrees.pop() || ({} as IChartResponse);

			result[currentTree.id] = clone(currentTree);

			if (currentTree?.sub && currentTree?.sub.length) {
				stackSubTrees.push(...currentTree.sub);
			}
		}
	}

	return result;
}
