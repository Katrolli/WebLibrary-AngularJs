import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck {
  isLoggedIn: boolean = false;
  userName: any;

  constructor(private authService: AuthenticationService) {}

  ngDoCheck(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.setUserData();
  }

  onLogOut() {
    this.authService.logOut();
  }

  setUserData() {
    const data = localStorage.getItem('UserData');
    if (data) {
      let userObj = JSON.parse(data);
      return userObj.name;
    }
  }
}
