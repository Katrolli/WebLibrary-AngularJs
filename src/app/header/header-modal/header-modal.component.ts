import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticateClient } from 'src/app/services/authenticate.client';
import { AuthenticationService } from 'src/app/services/authentication.service';

export interface UpdateUser {
  id: string;
  name: string;
  password: string;
}

@Component({
  selector: 'book-modal',
  templateUrl: './header-modal.component.html',
})
export class HeaderModal implements OnInit, OnDestroy {
  public updateUserForm!: FormGroup;
  formError: string | null = null;
  private destroySub = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UpdateUser,
    private fb: FormBuilder,
    private modal: MatDialog,
    private authClient: AuthenticateClient,
    private authService: AuthenticationService
  ) {}

  submitUpdateUserForm() {
    if (!this.updateUserForm.valid) {
      console.log('failed validation');
      return (this.formError = 'Please correct the form.');
    }
    this.formError = null;
    const updateUserPayload = {
      name: this.updateUserForm.get('name')?.value,
      password: this.updateUserForm.get('password')?.value,
    };

    this.authClient.updateUser(this.data.id, updateUserPayload).subscribe({
      next: (updatedUser) => {
        console.log('user updated', updatedUser);
      },
      error: (err: any) => {
        this.formError =
          err.message || 'An error occurred while submitting the form.';
        console.error(err);
      },
    });
    this.modal.closeAll();
    this.authService.logOut();
    return;
  }

  closeModal() {
    this.modal.closeAll();
  }

  ngOnInit(): void {
    this.updateUserForm = this.fb.group({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    if (this.data) {
      this.updateUserForm.patchValue({
        id: this.data.id,
        name: this.data.name,
        password: this.data.password,
      });
    }
    this.updateUserForm.statusChanges
      .pipe(takeUntil(this.destroySub))
      .subscribe((status) => {
        if (status === 'VALID') {
          this.formError = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
