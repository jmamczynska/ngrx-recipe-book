import {User} from '../user.model';
import {AuthActions, AUTHENTICATE_FAIL, AUTHENTICATE_SUCCESS, LOGIN_START, LOGOUT, SIGN_UP} from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state: State = initialState, action: AuthActions) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      const user = new User(
          action.payload.email,
          action.payload.userId,
          action.payload.token,
          action.payload.expirationDate);
      return {
        ...state,
        user,
        authError: null,
        loading: false
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      };
    case LOGIN_START:
    case SIGN_UP:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AUTHENTICATE_FAIL:
      return {
        ...state,
        authError: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
