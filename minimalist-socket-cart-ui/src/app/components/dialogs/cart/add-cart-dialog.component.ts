import {AfterViewInit, Component, HostListener, Inject, InjectionToken, OnInit} from '@angular/core'
import {FormBuilder, FormGroup} from "@angular/forms"
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"
import {CartService} from "../../../services/cart.service"
import {MessageService} from "../../../services/message.service"
import {Cart} from "../../../model/cart/cart"
import {DatePipe} from "@angular/common"
import {TranslateService} from "@ngx-translate/core"

@Component({
  selector: 'app-add-cart-dialog',
  template: `
    <h2 mat-dialog-title>{{ "addCart.title" | translate }}</h2>

    <mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ "addCart.name" | translate }}</mat-label>
        <input autocomplete="off" matInput [(ngModel)]="name">
      </mat-form-field>
    </mat-dialog-content>

    <button mat-button class="mat-raised-button" (click)="autoGenerateCart()">
      {{ automaticCartNameByDate }}
    </button>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close="">{{ "addCart.close" | translate }}</button>
      <button mat-button class="mat-raised-button main-button" (click)="createCart()">{{ "addCart.save" | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class AddCartDialogComponent implements OnInit, AfterViewInit {
  name: string = ""
  automaticCartNameByDate: string

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddCartDialogComponent>,
              private cartService: CartService,
              private translateService: TranslateService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this.automaticCartNameByDate = this.generateAutomaticCartNameByDate()
  }

  ngAfterViewInit(): void {
    this.messageService.displayHelpMessagesInOrder([
      "Voit valita ehdotetun ostoskorin nimen automaattisesti painamalla 'Enter'-näppäintä"
    ])
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.createCart()
  }

  createCart(): void {
    if (!this.name) {
      this.name = this.generateAutomaticCartNameByDate()
    }

    this.cartService.createCart(this.name).subscribe(cart => {
      this.messageService.showInfo("addCart.success", 1000, { name: this.name })
      this.close(cart)
    })
  }

  close(cart: Cart): void {
    this.dialogRef.close(cart)
  }

  private generateAutomaticCartNameByDate(): string {
    const datePipe: DatePipe = new DatePipe("en-US")
    const date: string = <string>datePipe.transform(new Date(), 'dd.MM.yyyy')

    let automaticCartName: string = ""
    this.translateService.get("addCart.automaticCartName", { date })
      .subscribe(translatedCart => automaticCartName = translatedCart)

    return automaticCartName
  }

  autoGenerateCart(): void {
    this.name = this.automaticCartNameByDate
    this.createCart()
  }
}
