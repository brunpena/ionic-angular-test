export interface EventModel {
	id?: string;
	title?: string;
	description?: string;
	date?: string; // ISO string
	location?: string;
}

export const createEmptyEvent = (): EventModel => ({
	id: undefined,
	title: '',
	description: '',
	date: undefined,
	location: ''
});

