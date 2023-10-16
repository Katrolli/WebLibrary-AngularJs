import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-modal',
  templateUrl: 'error-modal.component.html',
})
export class ErrorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
