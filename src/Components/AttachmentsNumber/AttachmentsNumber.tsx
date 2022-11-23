import style from './attachment.module.scss';
import {
	stack,
	light,
	flag,
	target,
	lightning,
} from '../../assets/Images/Icons/icons';

export const AttachmentsNumber = (props: any) => {
	const getIcon = (title: string): any => {
		if (title === 'Marketing Launch') return stack;
		if (title === 'Banners for social networks') return light;
		if (title === 'Choosing a platform for ads') return flag;
		if (title === 'Custom issue level #4') return target;
		if (title === 'Custom issue level #5') return lightning;
		if (title === 'Custom task') return lightning;
	};
	return (
		<div className={style.icon}>
			<span className={style.icon_item}>{getIcon(props.title)}</span>
		</div>
	);
};
