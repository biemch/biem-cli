import {
	color,
	figures,
	ListrDefaultRendererLogLevels,
} from 'listr2';

export const rendererOptions = {
	collapseSubtasks: false,
	icon: {
		[ListrDefaultRendererLogLevels.WAITING]: figures.pointerSmall,
		[ListrDefaultRendererLogLevels.COMPLETED_WITH_FAILED_SISTER_TASKS]: figures.pointerSmall,
	},
	color: {
		[ListrDefaultRendererLogLevels.COMPLETED_WITH_FAILED_SISTER_TASKS]:
			(data: (string | undefined)): string => color.dim(data || ''),
	},
};
