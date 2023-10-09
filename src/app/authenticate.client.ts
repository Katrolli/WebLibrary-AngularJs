import { enviroment } from 'src/env';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticateClient {
  constructor(private httpClient: HttpClient) {}

  public login(email: string, password: string): Observable<string> {
    return this.httpClient.post(
      enviroment.api_url + '/auth/login',
      {
        email: email,
        password: password,
      },
      { responseType: 'text' }
    );
  }

  public signup(
    name: string,
    email: string,
    password: string
  ): Observable<string> {
    return this.httpClient.post(
      enviroment.api_url + '/users',
      {
        name: name,
        email: email,
        password: password,
      },
      {
        responseType: 'text',
      }
    );
  }
}