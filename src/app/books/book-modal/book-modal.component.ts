import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BooksComponent } from '../books.component';
import { BookService } from '../services/book.service';

export interface BookData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  category: string;
}

@Component({
  selector: 'book-modal',
  templateUrl: './book-modal.component.html',
})
export class BookModal implements OnDestroy, OnInit {
  public CreateBookForm!: FormGroup;
  public UpdateBookForm!: FormGroup;
  formError: string | null = null;
  private destroySub = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookData,
    private fb: FormBuilder,
    private bookService: BookService,
    private modal: MatDialog
  ) {}

  ngOnInit(): void {
    this.CreateBookForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
    this.UpdateBookForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
    });

    if (this.data) {
      // Update UpdateBookForm values if data is available

      this.UpdateBookForm.patchValue({
        id: this.data.id,
        title: this.data.title,
        description: this.data.description,
        imageUrl: this.data.imageUrl,
        category: this.data.category,
        author: this.data.author,
      });
    }
  }

  submitCreateForm() {
    if (this.CreateBookForm.valid) {
      this.bookService
        .createBook(
          this.CreateBookForm.get('title')?.value,
          this.CreateBookForm.get('description')?.value,
          this.CreateBookForm.get('imageUrl')?.value,
          this.CreateBookForm.get('category')?.value
        )
        .subscribe(
          (data) => {
            this.bookService.addBook(data);
          },
          (err) => {
            this.formError =
              err.message || 'An error occurred while submitting the form.';
            console.error(err);
          }
        );
    } else {
      this.formError = 'Please correct the form before submitting.';
    }
  }

  submitUpdateForm() {
    if (this.UpdateBookForm.valid) {
      this.bookService
        .updateBook(
          this.data.id,
          this.UpdateBookForm.get('title')?.value,
          this.UpdateBookForm.get('description')?.value,
          this.UpdateBookForm.get('author')?.value,
          this.UpdateBookForm.get('imageUrl')?.value,
          this.UpdateBookForm.get('category')?.value
        )
        .subscribe(
          (updatedBook) => {
            this.bookService.updateBookInList(updatedBook);
          },
          (err) => {
            this.formError = err.message || 'An error occurred while updating.';
            console.error(err);
          }
        );
    } else {
      this.formError = 'Please correct the form before submitting.';
    }
  }

  closeModal() {
    this.modal.closeAll();
  }

  ngOnDestroy() {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
