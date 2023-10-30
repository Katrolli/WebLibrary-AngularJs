import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { enviroment } from 'src/env';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<any>([]);
  public categories = this.categoriesSubject.asObservable();
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http
      .get(enviroment.api_url + '/categories')
      .pipe(tap((categories) => this.categoriesSubject.next(categories)));
  }
}
