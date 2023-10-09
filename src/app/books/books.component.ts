import { Component, OnInit } from '@angular/core';
import { BookService } from './services/book.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  books: any = [];
  public CreateBookForm!: FormGroup;
  isCreateBookForm: boolean = false;

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
      this.isCreateBookForm = !this.isCreateBookForm;
    } else {
      this.isCreateBookForm = !this.isCreateBookForm;
    }
  }

  submitForm() {
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
        (err) => {}
      );
  }
}
