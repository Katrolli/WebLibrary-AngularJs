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

  updateBookInList(updatedBook: any) {
    // Logic to update the book in the BehaviorSubject list
    const currentBooks = this.booksSubject.getValue();
    const index = currentBooks.findIndex(
      (book: any) => book.id === updatedBook.id
    );
    if (index !== -1) {
      currentBooks[index] = updatedBook;
      this.booksSubject.next([...currentBooks]);
    }
  }

  refreshBooks() {
    this.getBooks().subscribe((books: any) => {
      this.booksSubject.next(books);
    });
  }

  addBook(newBook: any) {
    const currentBooks = this.booksSubject.getValue();
    this.booksSubject.next([...currentBooks, newBook]);
  }

  getBooks(): Observable<any> {
    return this.http.get(enviroment.api_url + '/books');
  }
  deleteBook(id: string): Observable<any> {
    return this.http.delete(enviroment.api_url + '/books/' + id);
  }

  createBook(
    title: string,
    description: string,
    imageUrl: string,
    category: string
  ): Observable<any> {
    let payload = {
      title,
      description,
      imageUrl,
      category,
    };
    return this.http.post(enviroment.api_url + '/books', payload);
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
