export interface SubscriptionModel {
	id?: string;
	userId?: string;
	eventId?: string;
	createdAt?: string; // ISO date
}

export const createEmptySubscription = (): SubscriptionModel => ({
	id: undefined,
	userId: undefined,
	eventId: undefined,
	createdAt: undefined
});

