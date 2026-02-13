import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({ providedIn: 'root' })
export class PushService extends ApiService {

  register(token: string) {
    return this.post('/push/register', { token });
  }

  unregister() {
    return this.post('/push/unregister', {});
  }
}
