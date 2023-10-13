import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  public onSubmit() {
    this.authService.login(
      this.loginForm.get('email')!.value,
      this.loginForm.get('password')!.value
    );
  }
  public onAdminSubmit() {
    this.authService.adminLogin(
      this.loginForm.get('email')!.value,
      this.loginForm.get('password')!.value
    );
  }
}
