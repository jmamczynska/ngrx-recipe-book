export class User {
  constructor(
      public email: string,
      public id: string,
      private _token: string,
      private _tokenExpirationDate: Date
  ) {
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  hasValidToken(): boolean {
    return this._token === null || this._token === undefined ? false : true;
  }
}
