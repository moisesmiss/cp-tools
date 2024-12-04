export type Task = {
	id: number;
	assignee: string;
	assigneesArray: string[];
	name: string;
	status: string;
	priority: string;
	list: string;
	points: string;
	isCollaborative: boolean;
	collaborators: string[];
};
