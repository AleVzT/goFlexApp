import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environments } from '../../../environments/environments';
import { Observable, catchError, of, map, BehaviorSubject } from 'rxjs';
import { User } from "../interfaces/user.interface";

@Injectable({providedIn: 'root'})
export class UserServices {

  private baseUrl: string = environments.baseUrl;
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  getUsers(): void  {
    const url = `${this.baseUrl}/users`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-token', `${token}`);

    this.http.get<User[]>(url, { headers }).subscribe((users) => {
      this.usersSubject.next(users);
    });
  }

  getUsersById( id: string ): Observable<User|undefined> {
    const url = `${ this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);
    return this.http.get<User>( url, { headers })
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  addUser( user: User ): Observable<User> {
    const url = `${ this.baseUrl}/users`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);
    return this.http.post<User>( url, user, { headers });
  }

  updateUser( user: User ): Observable<User> {

    const url = `${ this.baseUrl}/users/${user._id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);
    if ( !user._id ) throw Error('User id is required');
    return this.http.patch<User>( url, user, { headers });
  }

  deleteUserById( id: String ): Observable<boolean> {
    const url = `${ this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);

      return this.http.delete( url, { headers })
        .pipe(
          catchError( err => of(false) ),
          map( resp => true)
        );
  }


}