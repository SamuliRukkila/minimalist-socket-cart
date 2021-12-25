import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'

@Component({
  selector: 'app-sticky-button',
  template: `
    <div class="sticky-btn">
      <button mat-fab (click)="handleClick()" class="btn-btn">
        <mat-icon>{{ logo }}</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .sticky-btn {
      position: fixed;
      right: .4em;
      bottom: 65px;
    }
    .btn-btn {
      background-color: #6A8EAE !important;
    }
  `]
})
export class StickyButtonComponent {
  @Input() logo: string
  @Output() onButtonClickEvent: EventEmitter<void> = new EventEmitter()

  handleClick(): void {
    this.onButtonClickEvent.emit()
  }
}
