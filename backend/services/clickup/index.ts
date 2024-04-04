import axios, { AxiosInstance } from 'axios';
import { ViewTasksParams } from './types';

class ClickUp {
	private api: AxiosInstance;
	constructor() {
		const instance = axios.create({
			baseURL: 'https://api.clickup.com/api/v2',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${process.env.CLICKUP_API_TOKEN}`,
			},
		});
		instance.interceptors.response.use(
			(r) => r.data,
			(e) => Promise.reject(e)
		);
		this.api = instance;
	}

	async getViewTasks({ viewId, page }: ViewTasksParams) {
		return this.api
			.get(`/view/${viewId}/task`, {
				params: { page },
			})
			.then((r: any) => {
				return r.data;
			});
	}
}

export default new ClickUp();
