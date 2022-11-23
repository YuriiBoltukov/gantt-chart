import { useState } from 'react';
import { right } from '../../assets/Images/Icons/icons';
import style from './ChartTasks.module.scss';
import { IChartResponse } from '../../interface/interface';
import { AttachmentsNumber } from '../AttachmentsNumber/AttachmentsNumber';
import { setActiveStatusById } from '../../state/actions/tasksActions';
import { useDispatch, useSelector } from 'react-redux';
import { TasksState } from '../../state/reducers/tasksReducer';
export const ChartTasks = ({
	id,
	title,
	sub,
	level,
}: {
	id: number;
	title: string;
	level: number;
	sub: IChartResponse[];
}) => {
	const chartData = useSelector(
		({ tasks: { taskMatcher } }: { tasks: TasksState }) =>
			taskMatcher ? taskMatcher[id] : ({} as IChartResponse)
	);

	const [active, setActive] = useState<boolean>(chartData?.active ?? false);

	const dispatch = useDispatch();

	const handleClick = (id: number) => {
		dispatch(setActiveStatusById(id));

		setActive(!active);
	};

	return (
		<div key={id} className={style.wrapper}>
			<div
				onClick={() => handleClick(id)}
				className={
					level === 0
						? `${style.menu_item}  ${style.menu_item_first}`
						: `${style.menu_item}`
				}>
				{sub?.length && (
					<button className={style.menu_item_btn}>
						<span
							className={
								active
									? `${style.menu_item_icon} ${style.menu_item_icon_active}`
									: style.menu_item_icon
							}>
							{right}
						</span>
					</button>
				)}
				<h4 className={style.title}>
					<AttachmentsNumber title={title} />
					<span className={style.item_sub}>
						{sub?.length ? sub?.length : 0}
					</span>
					{title}
				</h4>
			</div>

			<div>
				{active &&
					(sub ?? []).map((node: any, index: any) => (
						<ChartTasks {...node} level={level + 1} key={index} />
					))}
			</div>
		</div>
	);
};
