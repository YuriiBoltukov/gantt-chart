import { useEffect, useState } from 'react';
import style from './App.module.scss';
import { ChartTasks } from './Components/ChartTasks/ChartTasks';
import {
	IChartResponse,
	IDataResponse,
	ITimeLine,
} from './interface/interface';
import { Bar } from './Components/Bar/bar';
import moment from 'moment';
import { Header } from './Components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from './state/services/tasksService';
import { setTasks } from './state/actions/tasksActions';
import { clone } from 'ramda';

function App() {
	const chartData = useSelector((state: any) => state.tasks.taskList);

	const dispatch = useDispatch();

	const [loading, setLoading] = useState<boolean>(false);

	const [periodDate, setPeriodDate] = useState<ITimeLine[]>();

	const [minDate, setMinDate] = useState<moment.Moment | null>(null);

	const moment = require('moment');

	/**
	 * function for combining period of week ITimeLine
	 * @param {moment.Moment} startDate
	 * @returns {ITimeLine}
	 */
	function combinePeriod(startDate: moment.Moment): ITimeLine {
		const days: number[] = [];
		let date = clone(startDate);
		let period = '';

		for (let i = 0; i < 7; i++) {
			days.push(+date.format('DD'));

			if (i === 0) {
				period += date.format('DD MMM');
			} else if (i === 6) {
				period += ` -  ${date.format('DD MMM')}`;
			}

			date = date.add(1, 'days');
		}

		return { period, days };
	}

	/**
	 * Formatting data from dd.mm.yyyy to yyyymmdd
	 * @param {string} date
	 * @returns {string}
	 */
	function formatDateForMoment(date: string): string {
		return date.split('.').reverse().join('');
	}

	/**
	 * For building timeLine
	 * @param {IDataResponse} chartData
	 * @returns
	 */
	function combineTimeLine(chartData: IDataResponse): void {
		if (!chartData) return moment();

		const [dataFrom, dataTo]: moment.Moment[] = chartData.period
			.split('-')
			.map(data => moment(formatDateForMoment(data)));

		const minData: moment.Moment = getFirstWeekDay(dataFrom);

		const maxData: moment.Moment = getLastWeekDay(dataTo);

		const totalWeeks = maxData.diff(dataFrom, 'weeks');

		const timeLine: ITimeLine[] = [];

		for (let i = 0; i <= totalWeeks; i++) {
			timeLine.push(combinePeriod(minData));
			minData.add(7, 'days');
		}

		setPeriodDate(timeLine);
	}

	/**
	 * For getting last week date
	 * @param {moment.Moment} date
	 * @returns {moment.Moment}
	 */
	function getLastWeekDay(date: moment.Moment): moment.Moment {
		const result = clone(date);
		const day = result.day();

		return result.add(7 - day, 'days');
	}

	/**
	 * For getting first week date
	 * @param {moment.Moment} date
	 * @returns {moment.Moment}
	 */
	function getFirstWeekDay(date: moment.Moment): moment.Moment {
		const result = clone(date);
		const day = result.day();

		return result.subtract(day - 1, 'days');
	}

	/**
	 * For defining start date
	 * @returns {moment.Moment}
	 */
	function defineStartDate(chartData: IDataResponse): moment.Moment {
		if (!chartData) return moment();

		const stackSubTrees: IChartResponse[] =
			(chartData?.chart?.sub && [...chartData.chart.sub]) || [];

		let result: moment.Moment = moment(chartData.chart.period_start);

		if (stackSubTrees) {
			while (stackSubTrees.length) {
				const currentTree: IChartResponse =
					stackSubTrees.pop() || ({} as IChartResponse);

				const currentTime: moment.Moment = moment(currentTree?.period_start);

				if (result.diff(currentTime, 'days') > 0) {
					result = currentTime;
				}

				if (currentTree?.sub && currentTree?.sub.length) {
					stackSubTrees.push(...currentTree.sub);
				}
			}
		}

		return result;
	}

	/**
	 * For loading chart data
	 */
	async function getChartData(): Promise<void> {
		setLoading(true);
		const tasks: IDataResponse = await getTasks();

		setMinDate(getFirstWeekDay(defineStartDate(tasks)));
		combineTimeLine(tasks);

		setLoading(false);

		dispatch(setTasks(tasks));
	}

	useEffect(() => {
		getChartData();
	}, []);

	return (
		<div className={style.App}>
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<Header {...chartData} />
					<div className={style.table}>
						<div className={style.items}>
							<div className={style.header_app}>
								<p>Work item</p>
							</div>
							<div className={style.cells_wrapper}>
								<ChartTasks level={0} {...chartData?.chart} />
							</div>
						</div>
						<div className={style.chart}>
							<div className={style.chart_period_wrapper}>
								{periodDate &&
									periodDate.map((el, i) => {
										return (
											<div key={i}>
												<div className={style.chart_period}>
													<span>{el.period}</span>
												</div>
												<div className={style.chart_dates}>
													{el.days.map((num, index) => {
														return (
															<p className={style.chart_day} key={index}>
																{num}
															</p>
														);
													})}
												</div>
											</div>
										);
									})}
							</div>
							<div className={style.chart_col_wrapper}>
								{[...new Array((periodDate?.length ?? 1) * 7)].map(
									(el, index) => {
										return <div className={style.chart_col} key={index}></div>;
									}
								)}
							</div>
							<div className={style.bars_wrapper} style={{ left: 0 }}>
								{chartData && (
									<Bar chart={chartData.chart} startDate={minDate} level={0} />
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default App;
