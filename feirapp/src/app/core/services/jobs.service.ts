import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({ providedIn: 'root' })
export class JobsService extends ApiService {

  run(name: string) {
    return this.get(`/jobs/${name}`);
  }

  logs(id: string) {
    return this.get(`/jobs/${id}/logs`);
  }
}
