import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from './services/book.service';
import { MatDialog } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';
import { BookModal } from './book-modal/book-modal.component';
import { enviroment } from 'src/env';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit, OnDestroy {
  apiUrl = enviroment.api_url + '/';
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
    console.log(this.books);

    this.bookService
      .deleteBook(bookId)
      .pipe(takeUntil(this.destroySub))
      .subscribe(() => {
        this.bookService.refreshBookOnDelete(bookId);
      });
    console.log(this.books);
  }

  toggleCreateModal() {
    this.modal.open(BookModal);
  }

  toggleEditModal(book: any) {
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
