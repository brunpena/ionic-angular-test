import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private base = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.base}${path}`);
  }
  
  post<T>(url: string, body?: any) {
    return this.http.post<T>(this.base + url, body);
  }

  patch<T>(url: string, body?: any) {
    return this.http.patch<T>(this.base + url, body);
  }

  put<T>(url: string, body?: any) {
    return this.http.put<T>(this.base + url, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.base + url);
  }
}
