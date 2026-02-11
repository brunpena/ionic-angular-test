import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService extends ApiService {

  list() {
    return this.get('/subscriptions'); // admin
  }

  mySubscriptions() {
    return this.get('/subscriptions/me'); 
  }

  getById(id: string) {
    return this.get(`/subscriptions/${id}`);
  }

  create(data: any) {
    return this.post('/subscriptions', data);
  }

  update(id: string, data: any) {
    return this.put(`/subscriptions/${id}`, data);
  }

  cancel(id: string) {
    return this.patch(`/subscriptions/${id}/cancel`, {});
  }
}