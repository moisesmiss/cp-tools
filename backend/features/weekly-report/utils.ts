import ClickUpApi from '@services/clickup';

export function getTasks() {
	return ClickUpApi.getViewTasks({ viewId: '27bwj-46902', page: 0 });
}
