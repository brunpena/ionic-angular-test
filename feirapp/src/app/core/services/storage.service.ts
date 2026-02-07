import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

  getItem<T = string>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {}
  }
}
