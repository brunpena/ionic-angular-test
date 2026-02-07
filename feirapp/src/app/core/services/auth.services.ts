import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private _token?: string;

	isAuthenticated(): boolean {
		return !!this._token;
	}

	login(token: string) {
		this._token = token;
	}

	logout() {
		this._token = undefined;
	}
}

