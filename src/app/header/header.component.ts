import { Component, DoCheck } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements DoCheck {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthenticationService) {}

  ngDoCheck(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onLogOut() {
    this.authService.logOut();
  }
}
