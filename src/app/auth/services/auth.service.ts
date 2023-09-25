import { Injectable, signal, computed } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environments } from '../../../environments/environments';
import { Observable, catchError, of, map, tap, throwError } from "rxjs";
import { User, AuthStatus, LoginResponse, CheckTokenResponse } from '../interfaces';

@Injectable({providedIn: 'root'})
export class AuthServices {

  private readonly baseUrl: string = environments.baseUrl;

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );
  
  constructor(private http: HttpClient) { 
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);

    return true
  }

  login( email: string, password: string): Observable<boolean> {
    const url = `${ this.baseUrl}/auth/login`;
    const body = { email, password }

    return this.http.post<LoginResponse>( url, body)
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError( err => throwError( () => err.error.msg ))
      );
  }

  checkAuthStatus() {
    const url = `${ this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    
    if( !token ) {
      this.logout();
      return of(false);
    }
    this._authStatus.set( AuthStatus.authenticated );

    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);
    
    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError(() => {
          this._authStatus.set( AuthStatus.notAuthenticated );
          return of(false);
        })
      );

  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
  }

}