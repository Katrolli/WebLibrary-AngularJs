import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './books/books.component';
import { CategoriesComponent } from './categories/categories.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { TokenInterceptor } from './helpers/token.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { BookModal } from './books/book-modal/book-modal.component';
import { HeaderModal } from './header/header-modal/header-modal.component';
import { ErrorInterceptor } from './errors/error.interceptor';
import { ErrorModalComponent } from './errors/error.modal.component';
import { BookCardComponent } from './books/book-card/book-card.component';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    CategoriesComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    BookModal,
    ErrorModalComponent,
    HeaderModal,
    BookCardComponent,
  ],
  imports: [
    BrowserModule,
    MatMenuModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
