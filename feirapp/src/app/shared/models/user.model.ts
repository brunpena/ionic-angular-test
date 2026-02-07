export interface User {
	id?: string;
	name?: string;
	email?: string;
	avatarUrl?: string;
}

export const createEmptyUser = (): User => ({
	id: undefined,
	name: '',
	email: '',
	avatarUrl: ''
});

