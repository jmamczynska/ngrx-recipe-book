import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {exhaustMap, map, take} from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from './store/auth.reducer';
import {Store} from '@ngrx/store';
import {User} from './user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private store: Store<fromApp.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
        take(1),
        map((state: fromAuth.State) => state.user),
        exhaustMap((user: User) => {
          if (!user) {
            return next.handle(req);
          }
          const modifiedRequest = req.clone({params: new HttpParams().set('auth', user.token)});
          return next.handle(modifiedRequest);
        }));
  }
}
