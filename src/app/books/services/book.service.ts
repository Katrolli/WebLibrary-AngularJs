import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/env';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

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
}
