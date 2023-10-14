import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/env';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private booksSubject = new BehaviorSubject<any>([]);
  public books = this.booksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshBooks();
  }

  refreshBooks() {
    this.getBooks().subscribe((books: any) => {
      this.booksSubject.next(books);
    });
  }

  getBooks(): Observable<any> {
    return this.http.get(enviroment.api_url + '/books');
  }

  refreshBookOnUpdate(updatedBook: any) {
    const currentBooks = this.booksSubject.getValue();
    const index = currentBooks.findIndex(
      (book: any) => book.id === updatedBook.id
    );
    if (index !== -1) {
      currentBooks[index] = updatedBook;
      this.booksSubject.next([...currentBooks]);
      console.log('updating on Update');
    }
  }

  refreshBookOnCreate(newBook: any) {
    const currentBooks = this.booksSubject.getValue();
    this.booksSubject.next([...currentBooks, newBook]);
    console.log('updating on Create');
  }

  refreshBookOnDelete(id: any) {
    const currentBooks = this.booksSubject
      .getValue()
      .filter((book: any) => book.id !== id);
    this.booksSubject.next([...currentBooks]);
    console.log('updating on delete');
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(enviroment.api_url + '/books/' + id);
  }

  createBook(book: any): Observable<any> {
    return this.http.post(enviroment.api_url + '/books', book);
  }

  updateBook(
    id: string,
    newTitle: string,
    newDescription: string,
    newAuthor: string,
    newImageUrl: string,
    newCategory: string
  ): Observable<any> {
    let payload = {
      title: newTitle,
      description: newDescription,
      authorId: newAuthor,
      imageUrl: newImageUrl,
      category: newCategory,
    };

    return this.http.patch(enviroment.api_url + '/books/' + id, payload);
  }
}
