import style from './header.module.scss';
import { exportIcon } from '../../assets/Images/Icons/icons';
import { IDataResponse } from '../../interface/interface';

export const Header = ({ project, period }: IDataResponse) => {
	function exportView() {
		window.print();
	}
	return (
		<div className={style.header}>
			<h1 className={style.title}>{`${project} / ${period}`}</h1>
			<button className={style.button}>Get Mock data</button>
			<button className={style.button} onClick={exportView}>
				{exportIcon}
				<span>Export</span>
			</button>
		</div>
	);
};
