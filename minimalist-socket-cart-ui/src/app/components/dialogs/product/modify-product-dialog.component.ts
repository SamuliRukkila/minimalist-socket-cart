import {Component, HostListener, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"
import {ProductService} from "../../../services/product.service"
import {CartAction, CartDialogAction} from "../../../model/constants"

@Component({
  selector: 'app-edit-delete-product-dialog',
  template: `
    <h2 mat-dialog-title>{{ "modifyProduct.title" | translate }}</h2>

    <mat-dialog-content>
      <div class="div-wrapper">
        <mat-form-field class="product-name-field">
          <mat-label>{{ "modifyProduct.name" | translate }}</mat-label>
          <input autocomplete="off" matInput [(ngModel)]="name"
                 [placeholder]="'modifyProduct.namePlaceholder' | translate">
        </mat-form-field>
        <mat-form-field class="product-amount-field">
          <mat-label>{{ "modifyProduct.amount" | translate }}</mat-label>
          <input autocomplete="off" [placeholder]="'modifyProduct.amountPlaceholder' | translate"
                 matInput type="number" min="1" max="99" [(ngModel)]="amount">
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close="">{{ "modifyProduct.close" | translate }}</button>
      <button mat-button class="mat-raised-button delete-product-button" (click)="deleteProduct()">
        {{ "modifyProduct.delete" | translate }}
      </button>
      <button mat-button class="mat-raised-button main-button" (click)="saveUpdatedProduct()">
        {{ "modifyProduct.save" | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .div-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .product-name-field {
      width: 60%;
      margin-right: .5em;
    }

    .product-amount-field {
      width: 20%;
    }

    .delete-product-button {
      background-color: #d34b55;
      color: white;
    }
  `]})
export class ModifyProductDialogComponent implements OnInit {

  name: string = ""
  amount: number = 1

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ModifyProductDialogComponent>,
              private productService: ProductService) {}

  ngOnInit(): void {
    this.name = this.data.product.name
    this.amount = this.data.product.amount
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.saveUpdatedProduct()
  }

  close(productAction: CartDialogAction): void {
    this.dialogRef.close(productAction)
  }

  saveUpdatedProduct(): void {
    if (this.name) {
      this.data.product.name = this.name
      this.data.product.amount = this.amount
      this.productService.updateProduct(this.data.product)
        .subscribe(updatedProduct =>
          this.close({ action: CartAction.UPDATE, product: updatedProduct}))
    }
  }

  deleteProduct(): void {
    this.productService.deleteProduct(this.data.product.id)
      .subscribe(() =>
        this.close({ action: CartAction.DELETE, product: this.data.product }))
  }
}
