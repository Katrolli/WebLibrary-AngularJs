import { Component, DoCheck } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';

import { HeaderModal } from './header-modal/header-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck {
  isLoggedIn: boolean = false;
  user: {
    name: string;
    userId: string;
  } = { name: '', userId: '' };

  constructor(
    private authService: AuthenticationService,
    private modal: MatDialog
  ) {}

  ngDoCheck(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.setUserData();
  }

  toggleUpdateModal() {
    this.modal.open(HeaderModal, {
      data: {
        id: this.user.userId,
      },
    });
  }

  onLogOut() {
    this.authService.logOut();
  }

  setUserData() {
    const data = localStorage.getItem('UserData');
    if (data) {
      let userObj = JSON.parse(data);
      return userObj;
    }
  }
}
