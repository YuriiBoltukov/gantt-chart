export interface IDataResponse {
	chart: IChartResponse;
	period: string;
	project: string;
}

export interface IChartResponse {
	id: number;
	period_end: string;
	period_start: string;
	sub?: IChartResponse[];
	title: string;
	chart?: IChartResponse;
	active?: boolean;
}

export interface IDateArray {
	startDate: number;
	endDate: number;
	startMonth: number;
	endMonth: number;
}

export interface IScheduleColor {
	[color: string]: [string, string];
}

export interface ICoordinates {
	x1: number;
	x2: number;
}

export interface ITimeLine {
	period: string;
	days: number[];
}
