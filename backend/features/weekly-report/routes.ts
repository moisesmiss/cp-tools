import express from 'express';
import fs from 'fs';
import * as csv from '@fast-csv/parse';
import { type Task } from '@features/weekly-report/types';
import { resources } from '@constants/directories';
const router = express.Router();

router.get('/csv', async (req, res, next) => {
	try {
		const jsonData: Task[] = [];
		fs.createReadStream(`${resources}/reporte.csv`)
			.pipe(csv.parse({ headers: true }))
			.on('error', (error) => console.error(error))
			.on('data', (row) => {
				// jsonData.push(row);
				// return;
				const assignees = row['Assignee'].replace(/^\[|\]$/g, '').split(',');
				if (assignees.length > 1) {
					return;
				}
				jsonData.push({
					id: row['Task Custom ID'],
					assignee: assignees[0],
					name: row['Task Name'],
					status: row['Status'],
					priority: row['Priority'],
					list: row['List'],
					points: row['Points Estimate'],
				});
			})
			.on('end', () => {
				// res.json(jsonData);
				// return;
				const result = jsonData.reduce(function (r, a) {
					r[a.assignee] = r[a.assignee] || [];
					r[a.assignee].push(a);
					return r;
				}, Object.create(null));

				const sortTask = (tasks: Task[]) => {
					let resultTasks: Task[] = [];
					['Closed', 'in review', 'in progress'].forEach((status) => {
						const filterTasks = tasks.filter((task) => task.status === status);
						resultTasks = [...resultTasks, ...filterTasks];
					});
					return resultTasks;
				};
				let message = '';
				const emojis: Record<string, string> = {
					Closed: '🟢',
					'in review': '🟡',
					'in progress': '🔵',
				};
				const pointsEmojis: Record<string, string> = {
					'1': '🔥',
					'2': '🔥🔥',
					'3': '🔥🔥🔥',
					'5': '🔥🔥🔥🔥',
					'8': '🔥🔥🔥🔥🔥',
				};
				for (const person in result) {
					const tasks = sortTask(result[person]);
					result[person] = tasks;
					message += `<strong>${person}:</strong> <br>`;
					tasks.forEach((task) => {
						message += `${emojis[task.status] || task.status} [<a href="https://app.clickup.com/t/2338706/${task.id}">${task.id}</a>] (${pointsEmojis[task.points] || 'null'}) ${task.name} <br>`;
					});
					message += '<br>';
				}

				message += '<br>';
				for (const status of Object.keys(emojis)) {
					message += `${emojis[status]} = ${status}<br>`;
				}
				res.send(`<p>${message}</p>`);
			});
	} catch (error) {
		next(error);
	}
});

export default router;
