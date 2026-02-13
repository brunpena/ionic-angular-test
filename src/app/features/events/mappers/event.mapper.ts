import { EventCategory, EventModel } from 'src/app/shared/models/event.model';

// ============================
// BACKEND SHAPE
// ============================

export interface ApiEvent {
  id: string;

  title: string;
  description: string;
  imageUrl?: string;

  startDate: string;
  endDate?: string;

  location: string;
  city: string;

  category?: EventCategory;

  maxCapacity: number;
  isSubscribed: boolean;
  subscribersCount: number;

  createdAt?: string;
  updatedAt?: string;
}

// ============================
// MAPPER
// ============================

export function mapApiToEvent(api: ApiEvent): EventModel {
  return {
    id: api.id,

    title: api.title,
    description: api.description,
    imageUrl: api.imageUrl,

    startDate: api.startDate,
    endDate: api.endDate,

    location: api.location,
    city: api.city,

    category: api.category ?? EventCategory.OUTROS,

    maxCapacity: api.maxCapacity,

    subscribersCount: api.subscribersCount ?? 0,
    isSubscribed: api.isSubscribed,

    createdAt: api.createdAt ?? new Date().toISOString(),
    updatedAt: api.updatedAt ?? new Date().toISOString(),

  };
}
