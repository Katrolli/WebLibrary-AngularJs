import { Injectable } from '@angular/core';
import { AuthenticateClient } from './authenticate.client';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly token = '';

  constructor(private authClient: AuthenticateClient, private router: Router) {}

  public login(email: string, password: string) {
    this.authClient.login(email, password).subscribe((response) => {
      const token = response.access_token;
      localStorage.setItem('accessToken', token);
      const decodedToken = this.decodeToken(token);
      this.setUserData(decodedToken);
      this.router.navigate(['/books']);
    });
  }

  public adminLogin(email: string, password: string) {
    this.authClient.adminLogin(email, password).subscribe((response) => {
      const token = response.access_token;
      localStorage.setItem('accessToken', token);
      const decodedToken = this.decodeToken(token);
      this.setUserData(decodedToken);
      this.router.navigate(['/books']);
    });
  }

  public signUp(name: string, email: string, password: string) {
    this.authClient.signup(name, email, password).subscribe(
      (user) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.router.navigate(['/signup']);
        console.error('Failed to sign up', error);
      }
    );
  }

  public logOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('UserData');
    this.router.navigate(['/login']);
  }

  public decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  private setUserData(data: any): void {
    localStorage.setItem('UserData', JSON.stringify(data));
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem('accessToken');
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    const stored = localStorage.getItem('accessToken');

    if (stored) {
      try {
        return stored || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  removeToken(token: string | null) {
    if (token) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('UserData');
    }
  }
}
