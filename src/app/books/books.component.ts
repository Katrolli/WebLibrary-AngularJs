import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from './services/book.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';
import { BookModal } from './book-modal/book-modal.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit, OnDestroy {
  books: any = [];
  private destroySub = new Subject<void>();

  constructor(private bookService: BookService, private modal: MatDialog) {}

  ngOnInit(): void {
    this.bookService.books
      .pipe(takeUntil(this.destroySub))
      .subscribe((books) => {
        this.books = books;
      });
  }

  onDeleteBook(bookId: string) {
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.books = this.books.filter((book: any) => book.id !== bookId);
    });
  }

  toggleCreate() {
    this.modal.open(BookModal);
  }
  toggleEdit(book: any) {
    // Include 'id' in the format object
    const format = {
      id: book.id,
      ...book,
      author: book.author.name,
      category: book.category.name,
    };
    this.modal.open(BookModal, {
      data: format,
    });
  }

  ngOnDestroy() {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
