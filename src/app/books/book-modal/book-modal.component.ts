import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BookService } from '../services/book.service';
import { CategoryService } from 'src/app/categories/services/categories.service';
import { AuthorService } from 'src/app/authors/services/author.service';

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
  public categories: any[] = [];
  public authors: any[] = [];

  public CreateBookForm!: FormGroup;
  public UpdateBookForm!: FormGroup;
  formError: string | null = null;
  selectedFile: File | null = null;
  private destroySub = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookData,
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private modal: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('categories fetched', categories);
      },
      error: (err) => {
        console.log('error fetching categories', err);
      },
    });

    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
        console.log('authors fetched', authors);
      },
      error: (err) => {
        console.log('error fetching authors', err);
      },
    });

    this.CreateBookForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
    });
    this.UpdateBookForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
    });

    if (this.data) {
      this.UpdateBookForm.patchValue({
        id: this.data.id,
        title: this.data.title,
        description: this.data.description,
        imageUrl: this.data.imageUrl,
        category: this.data.category,
        author: this.data.author,
      });
    }
    this.CreateBookForm.statusChanges
      .pipe(takeUntil(this.destroySub))
      .subscribe((status) => {
        if (status === 'VALID') {
          this.formError = null;
        }
      });

    this.UpdateBookForm.statusChanges
      .pipe(takeUntil(this.destroySub))
      .subscribe((status) => {
        if (status === 'VALID') {
          this.formError = null;
        }
      });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.formError = null;
    }
  }

  submitCreateForm() {
    console.log('entered form');

    if (!this.CreateBookForm.valid) {
      console.log('failed validation');
      return (this.formError = 'Please correct the form.');
    }

    this.formError = null;
    const CreateFormData = new FormData();

    CreateFormData.append('title', this.CreateBookForm.get('title')?.value);
    CreateFormData.append(
      'description',
      this.CreateBookForm.get('description')?.value
    );
    CreateFormData.append(
      'category',
      this.CreateBookForm.get('category')?.value
    );
    CreateFormData.append('author', this.CreateBookForm.get('author')?.value);

    if (this.selectedFile) {
      CreateFormData.append(
        'imageUrl',
        this.selectedFile,
        this.selectedFile.name
      );
    } else {
      return (this.formError = 'Please select an image.');
    }
    console.log('before book service');

    this.bookService.createBook(CreateFormData).subscribe({
      next: (newBook) => {
        console.log('new book created here');
        this.bookService.refreshBookOnCreate(newBook);
      },
      error: (err: any) => {
        this.formError =
          err.message || 'An error occurred while submitting the form.';
        console.error(err);
      },
    });
    console.log('after book service');
    this.closeModal();
    return;
  }

  submitUpdateForm() {
    if (!this.UpdateBookForm.valid) {
      console.log('failed validation');
      return (this.formError = 'Please correct the form.');
    }

    this.formError = null;
    const updateFormData = new FormData();
    updateFormData.append('title', this.UpdateBookForm.get('title')?.value);
    updateFormData.append(
      'description',
      this.UpdateBookForm.get('description')?.value
    );
    updateFormData.append(
      'category',
      this.UpdateBookForm.get('category')?.value || this.data.category
    );
    updateFormData.append(
      'author',
      this.UpdateBookForm.get('author')?.value || this.data.author
    );

    if (this.selectedFile) {
      updateFormData.append(
        'imageUrl',
        this.selectedFile,
        this.selectedFile.name
      );
    } else {
      updateFormData.append('imageUrl', this.data.imageUrl);
    }

    if (
      this.UpdateBookForm.get('title')?.value &&
      this.UpdateBookForm.get('description')?.value &&
      this.UpdateBookForm.get('author')?.value &&
      this.UpdateBookForm.get('category')?.value
    ) {
      this.bookService
        .updateBook(this.data.id, updateFormData)
        // .pipe(takeUntil(this.destroySub))
        .subscribe({
          next: (updatedBook) => {
            console.log('book updated here');
            this.bookService.refreshBookOnUpdate(updatedBook);
          },
          error: (err: any) => {
            this.formError =
              err.message || 'An error occurred while submitting the form.';
            console.error(err);
          },
        });
      this.closeModal();
      return;
    }
    return;
  }

  closeModal() {
    this.modal.closeAll();
  }

  ngOnDestroy() {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
