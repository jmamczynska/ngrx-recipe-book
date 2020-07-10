import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {User} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private readonly signUpUrl = this.url + ':signUp?key=' + environment.firebaseAPIKey;
  private readonly loginUrl = this.url + ':signInWithPassword?key=' + environment.firebaseAPIKey;

  userSubject = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {
  }

  signUp(userEmail: string, userPassword: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.signUpUrl, {
      email: userEmail,
      password: userPassword,
      returnSecureToken: true
    }).pipe(catchError(errorResponse => throwError(this.handleErrorResponse(errorResponse))),
        tap(response => this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
        )));
  }

  login(userEmail: string, userPassword: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.loginUrl, {
      email: userEmail,
      password: userPassword,
      returnSecureToken: true
    }).pipe(catchError(errorResponse => throwError(this.handleErrorResponse(errorResponse))),
        tap(response => this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
        )));
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.hasValidToken()) {
      this.userSubject.next(loadedUser);
    }
  }

  private handleAuthentication(email: string, localId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, token, expirationDate);
    this.userSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse): string {
    let message = 'An unexpected error occurred during login process';
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        message = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        message = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        message = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        message = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        message = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        message = 'The user account has been disabled by an administrator.';
        break;
    }
    return message;
  }
}
