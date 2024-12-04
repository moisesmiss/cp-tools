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
				const assignees = row['Assignee'].replace(/^\[|\]$/g, '').split(',');
				const baseTask = {
					id: row['Task Custom ID'],
					assignee: assignees.join(', '),
					assigneesArray: assignees,
					name: row['Task Name'],
					status: row['Status'],
					priority: row['Priority'],
					list: row['List'],
					points: row['Points Estimate'],
					isCollaborative: assignees.length > 1,
					collaborators: assignees.length > 1 ? assignees : [],
				};

				assignees.forEach((assignee: string) => {
					jsonData.push({
						...baseTask,
						assignee: assignee.trim(),
						collaborators: assignees.length > 1 ? assignees.filter((a: string) => a.trim() !== assignee.trim()) : [],
					});
				});
			})
			.on('end', () => {
				const result = jsonData.reduce(
					(acc, task) => {
						const hasIndividualTasks = jsonData.some((t) => t.assignee === task.assignee && !t.isCollaborative);

						if (hasIndividualTasks && !acc[task.assignee]) {
							acc[task.assignee] = {
								tasks: [],
								totalSprintPoints: 0,
							};
						}

						if (hasIndividualTasks) {
							acc[task.assignee].tasks.push(task);
							acc[task.assignee].totalSprintPoints += Number(task.points) || 0;
						}

						return acc;
					},
					{} as Record<string, { tasks: Task[]; totalSprintPoints: number }>
				);

				const sortTask = (tasks: Task[]) => {
					const closedTasks = tasks.filter((task) => task.status === 'Closed');
					const inProgressTasks = tasks.filter((task) => task.status === 'in progress');
					const otherTasks = tasks.filter((task) => task.status !== 'Closed' && task.status !== 'in progress');

					return [...closedTasks, ...otherTasks, ...inProgressTasks];
				};
				let message = '';
				const emojis: Record<string, string> = {
					Closed: '🟢',
					'in progress': '🔵',
					default: '🟡', // emoji por defecto para todos los demás estados
				};
				const pointsEmojis: Record<string, string> = {
					'1': '🔥',
					'2': '🔥🔥',
					'3': '🔥🔥🔥',
					'5': '🔥🔥🔥🔥',
					'8': '🔥🔥🔥🔥🔥',
				};
				for (const person in result) {
					const sortedTasks = sortTask(result[person].tasks);
					result[person].tasks = sortedTasks;
					message += `<strong>${person}:</strong> (🔥 ${result[person].totalSprintPoints}) <br>`;
					sortedTasks.forEach((task) => {
						message += `${task.status === 'Closed' || task.status === 'in progress' ? emojis[task.status] : emojis.default} [<a href="https://app.clickup.com/t/2338706/${task.id}">${task.id}</a>] (${pointsEmojis[task.points] || 'null'}) ${task.isCollaborative ? '👥 ' : ''} ${task.name}${task.collaborators.length ? ` (with ${task.collaborators.join(', ')})` : ''} <br>`;
					});
					message += '<br>';
				}

				message += '<br>';
				for (const status of Object.keys(emojis)) {
					message += `${emojis[status]} = ${status}<br>`;
				}
				message += `🔥 = Difficulty<br>`;
				message += `👥 = Collaborative task<br>`;
				res.send(`<p>${message}</p>`);
			});
	} catch (error) {
		next(error);
	}
});

export default router;
