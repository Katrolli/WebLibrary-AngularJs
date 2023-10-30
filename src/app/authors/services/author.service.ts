import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { enviroment } from 'src/env';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthorService {
  private authorsSubject = new BehaviorSubject<any>([]);
  public authors = this.authorsSubject.asObservable();
  constructor(private http: HttpClient) {}

  getAuthors(): Observable<any> {
    return this.http.get<any[]>(enviroment.api_url + '/users').pipe(
      map((users) => users.filter((user) => user.roleId === 1)),
      tap((filteredUsers) => this.authorsSubject.next(filteredUsers))
    );
  }
}
