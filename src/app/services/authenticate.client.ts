import { enviroment } from 'src/env';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticateClient {
  constructor(private httpClient: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    return this.httpClient.post(enviroment.api_url + '/auth/login', {
      email: email,
      password: password,
    });
  }

  public adminLogin(email: string, password: string): Observable<any> {
    return this.httpClient.post(enviroment.api_url + '/auth/admin', {
      email: email,
      password: password,
    });
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

  public updateUser(userId: string, payload: object): Observable<any> {
    const url = `${enviroment.api_url}/auth/update/${userId}`;

    return this.httpClient.post(url, payload);
  }
}
