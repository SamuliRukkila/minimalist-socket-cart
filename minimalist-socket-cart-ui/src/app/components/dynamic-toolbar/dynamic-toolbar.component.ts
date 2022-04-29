import {Component, EventEmitter, HostListener, Input, OnChanges, Output} from '@angular/core'

@Component({
  selector: 'app-dynamic-toolbar',
  template: `
    <mat-toolbar class="cart-list-toolbar">
      <span>{{ name | translate }}</span>
      <span class="toolbar-spacer"></span>
      <div *ngFor="let button of buttons" (click)="handleClick(button)">
        <button mat-icon-button class="example-icon">
          <mat-icon>{{ button }}</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <mat-toolbar [ngClass]="{'mat-elevation-z5' : true, 'sticky' : isSticky}"
                 class="cart-list-toolbar cart-list-toolbar-fixed">
      <span>{{ name }}</span>
      <span class="toolbar-spacer"></span>
      <div *ngFor="let button of buttons" (click)="handleClick(button)">
        <button mat-icon-button class="example-icon">
          <mat-icon>{{ button }}</mat-icon>
        </button>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./dynamic-toolbar.component.scss']
})
export class DynamicToolbarComponent implements OnChanges {
  @Input() name: string
  @Input() buttons: string[] = []
  @Output() onButtonClickEvent: EventEmitter<string> = new EventEmitter()

  defaultPageYOffset: number = 56

  isSticky: boolean = false

  ngOnChanges(): void {
    this.name = this.name?.length > 30 ?
        this.name?.substring(0, 30) + ".." :
        this.name
  }

  @HostListener('window:scroll', ['$event'])
  private checkScroll() {
    this.isSticky = window.pageYOffset >= this.defaultPageYOffset
  }

  handleClick(buttonName: string) {
    this.onButtonClickEvent.emit(buttonName)
  }
}
