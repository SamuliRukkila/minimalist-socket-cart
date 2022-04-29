import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'app-sticky-button',
  template: `
    <div class="sticky-btn-mini" *ngIf="smallVersion; else mediumButton">
      <button mat-mini-fab  (click)="handleClick()" class="btn-btn">
        <mat-icon>{{ logo }}</mat-icon>
      </button>
    </div>
    <ng-template #mediumButton>
      <div class="sticky-btn-normal">
        <button mat-fab (click)="handleClick()" class="btn-btn">
          <mat-icon>{{ logo }}</mat-icon>
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .sticky-btn-normal {
      position: fixed;
      right: .4em;
      bottom: 65px;
    }
    .sticky-btn-mini {
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
  @Input() smallVersion = false

  @Output() onButtonClickEvent: EventEmitter<void> = new EventEmitter()

  handleClick(): void {
    this.onButtonClickEvent.emit()
  }
}

