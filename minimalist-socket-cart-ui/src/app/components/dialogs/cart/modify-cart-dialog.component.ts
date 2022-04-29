import {Component, HostListener, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"
import {CartService} from "../../../services/cart.service"
import {CartAction, CartDialogAction} from "../../../model/constants"
import {MessageService} from "../../../services/message.service"

@Component({
  selector: "app-modify-cart-dialog",
  template: `
    <h2 mat-dialog-title>{{ "modifyCart.title" | translate }}</h2>

    <mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ "modifyCart.name" | translate }}</mat-label>
        <input matInput [(ngModel)]="name" autocomplete="off">
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close="">{{ "close" | translate }}</button>
      <button *ngIf="currentUserIsOwner" mat-button
              class="mat-raised-button delete-product-button" (click)="deleteCart()">
        {{ "delete" | translate }}
      </button>
      <button mat-button class="mat-raised-button main-button" (click)="saveUpdatedCart()">
        {{ "save" | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .delete-product-button {
      background-color: #d34b55;
      color: white;
    }
  `]
})
export class ModifyCartDialogComponent implements OnInit {

  name: string = ""
  currentUserIsOwner: boolean

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ModifyCartDialogComponent>,
              private cartService: CartService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this.name = this.data.cart.name
    this.currentUserIsOwner = this.data.currentUserIsOwner
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.saveUpdatedCart()
  }

  close(cartAction: CartDialogAction): void {
    this.dialogRef.close(cartAction)
  }

  saveUpdatedCart(): void {
    if (this.name) {
      this.data.cart.name = this.name
      this.cartService.updateCart(this.data.cart)
        .subscribe(updatedCart =>
          this.close({ action: CartAction.UPDATE, cart: updatedCart }))
    }
  }

  deleteCart(): void {
    this.cartService.deleteCart(this.data.cart)
      .subscribe(() => {
        this.messageService.showInfo(
          "modifyCart.deleteSuccess",
          1000,
          { name: this.name })
        this.close({ action: CartAction.DELETE, cart: this.data.cart })
      })
  }
}
