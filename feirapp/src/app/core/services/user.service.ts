import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
	private _currentUser: User | null = null;

	getCurrentUser(): Observable<User | null> {
		return of(this._currentUser);
	}

	setCurrentUser(user: User | null) {
		this._currentUser = user;
	}
}

