import { useEffect, useState } from 'react';

import style from './bar.module.scss';
import moment from 'moment/moment';
import { IChartResponse } from '../../interface/interface';
import { ICoordinates, IScheduleColor } from '../../interface/interface';

export const Bar = ({
	chart: { id, period_end, period_start, title, sub, active },
	startDate,
	level,
}: {
	chart: IChartResponse;
	level: number;
	startDate: moment.Moment | null;
}) => {
	const [coordinates, setCoordinates] = useState<ICoordinates | null>(null);

	const ScheduleColor: IScheduleColor = {
		blue: ['#E2EBFF', '#497CF6'],
		yellow: ['#FFF2E0', '#FFA530'],
		green: ['#CFF0D6', '#2DB77B'],
		gray: ['#f6f6f6', '#a9a9a9'],
	};

	/**
	 * function for defining color by level
	 * @param {number} level
	 * @returns {[string, string]} - color on the second position is darker then color in first position
	 */
	const defineColorsByLevel = (level: number): [string, string] => {
		switch (level) {
			case 0:
				return ScheduleColor.blue;
			case 1:
			case 4:
				return ScheduleColor.yellow;
			case 2:
			case 3:
				return ScheduleColor.green;
			default:
				return ScheduleColor.gray;
		}
	};

	function calcBarCoordinate(): { x1: number; x2: number } {
		const x1 = moment(period_start).diff(startDate, 'days') * 21;
		const x2 = (moment(period_end).diff(period_start, 'days') + 1) * 21;
		return { x1, x2 };
	}

	useEffect(() => {
		setCoordinates(calcBarCoordinate());
	}, []);

	return (
		<div key={id} className={style.wrapper} style={{ marginTop: 20 }}>
			<div
				style={{
					position: 'relative',
					left: coordinates?.x1 || 0,
				}}>
				<div
					style={{
						position: 'relative',
						height: 22,
						width: coordinates?.x2 || 0,
						backgroundColor: defineColorsByLevel(level)[0],
						borderColor: defineColorsByLevel(level)[1],
						borderWidth: 1,
						borderStyle: 'solid',
						opacity: 0.8,
						borderRadius: 6,
					}}></div>
				<div
					className={style.title}
					style={{
						left: (coordinates?.x2 || 0) + 8,
					}}>
					{title}
				</div>
			</div>

			{active
				? (sub ?? []).map((node: IChartResponse, index: number) => (
						<Bar
							chart={node}
							level={level + 1}
							startDate={startDate}
							key={index}
						/>
				  ))
				: null}
		</div>
	);
};
