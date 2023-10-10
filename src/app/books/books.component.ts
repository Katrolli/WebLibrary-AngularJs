import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from './services/book.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit, OnDestroy {
  books: any = [];
  public CreateBookForm!: FormGroup;
  isCreateBookForm: boolean = false;
  formError: string | null = null;
  private destroy = new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((BooksArray) => {
      this.books = BooksArray;
    });
  }

  onDeleteBook(bookId: string) {
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.books = this.books.filter((book: any) => book.id !== bookId);
    });
  }

  showForm() {
    if (!this.isCreateBookForm) {
      this.CreateBookForm = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        imageUrl: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required),
      });
      this.CreateBookForm.valueChanges
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.formError = null;
        });
      this.isCreateBookForm = !this.isCreateBookForm;
    } else {
      this.isCreateBookForm = !this.isCreateBookForm;
    }
  }

  submitForm() {
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
            this.books.push(data);
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
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
