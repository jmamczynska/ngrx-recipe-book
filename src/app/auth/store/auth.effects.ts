import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {AuthenticateSuccess} from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: HttpErrorResponse) => {
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
};

@Injectable()
export class AuthEffects {

  private readonly url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private readonly signUpUrl = this.url + ':signUp?key=' + environment.firebaseAPIKey;
  private readonly loginUrl = this.url + ':signInWithPassword?key=' + environment.firebaseAPIKey;

  @Effect()
  authSignUp = this.actions$.pipe(
      ofType(AuthActions.SIGN_UP),
      switchMap((signUpAction: AuthActions.SignUp) => {
        return this.http.post<AuthResponseData>(this.signUpUrl, {
          email: signUpAction.payload.email,
          password: signUpAction.payload.password,
          returnSecureToken: true
        }).pipe(
            map((response: AuthResponseData) => {
              return handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
            }),
            catchError(error => {
              const message = handleError(error);
              return of(new AuthActions.AuthenticateFail(message));
            }));
      })
  );

  @Effect()
  authLogin = this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(this.loginUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
            map((response: AuthResponseData) => {
              return handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
            }),
            catchError(error => {
              const message = handleError(error);
              return of(new AuthActions.AuthenticateFail(message));
            }));
      })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthenticateSuccess) => {
        if (authSuccessAction.payload.redirect) {
          this.router.navigate(['/']);
        }
      })
  );

  @Effect()
  authAutoLogin = this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return {type: 'DUMMY'};
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate));

        if (loadedUser.hasValidToken()) {
          return new AuthenticateSuccess({
            email: userData.email,
            userId: userData.id,
            token: userData._token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        } else {
          return {type: 'DUMMY'};
        }
      })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
  );

  constructor(
      private actions$: Actions,
      private http: HttpClient,
      private router: Router) {
  }
}
