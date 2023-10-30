import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
})
export class BookCardComponent {
  @Input() book: any;
  @Input() apiUrl: any;

  @Output() onDelete: EventEmitter<string> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  deleteBook() {
    this.onDelete.emit(this.book.id);
  }

  editBook() {
    this.onEdit.emit(this.book);
  }
}
