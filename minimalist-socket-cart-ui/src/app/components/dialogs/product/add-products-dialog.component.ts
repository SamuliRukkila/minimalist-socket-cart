import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core'
import {ProductService} from "../../../services/product.service"
import {FormArray, FormBuilder, FormGroup} from "@angular/forms"
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog"
import {Product} from "../../../model/product"
import {MessageService} from "../../../services/message.service"

@Component({
  selector: 'app-add-products-dialog',
  template: `
    <h2 mat-dialog-title>{{ "addProducts.title" | translate }}</h2>

    <mat-dialog-content style="overflow: scroll">
      <div class="div-wrapper">
        <mat-form [formGroup]="productForm">
          <div formArrayName="products">
            <div *ngFor="let item of products.controls let pointIndex=index" [formGroupName]="pointIndex">

              <mat-form-field class="product-name-field">
                <mat-label>{{ "addProducts.name" | translate }}</mat-label>
                <input matInput autocomplete="off"
                       [placeholder]="'addProducts.productName' | translate" #inputName autofocus
                       formControlName="name" (keydown.enter)="onFieldEnterPress(pointIndex, 'name')">
              </mat-form-field>

              <mat-form-field class="product-amount-field">
                <mat-label>{{ "addProducts.amount" | translate }}</mat-label>
                <input autocomplete="off" placeholder="1-99" matInput formControlName="amount" #inputAmount
                       type="number" min="1" max="99" (keydown.enter)="onFieldEnterPress(pointIndex, 'amount')">
              </mat-form-field>

              <button class="remove-row-icon" (click)="deleteProduct(pointIndex)" mat-icon-button
                      *ngIf="productForm.value['products'].length > pointIndex + 1 else addRowButton">
                <mat-icon>remove_circle_outline</mat-icon>
              </button>

              <ng-template #addRowButton>
                <button class="add-row-icon" (click)="addRow()" mat-icon-button
                        [disabled]="!productForm.value['products'][pointIndex].productName ||
                                    !productForm.value['products'][pointIndex].amount">
                  <mat-icon>add_circle</mat-icon>
                </button>
              </ng-template>
            </div>
          </div>
        </mat-form>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button>{{ "addProducts.close" | translate }}</button>
      <button mat-button class="mat-raised-button main-button"
              (click)="saveProducts()">{{ "addProducts.addProducts" | translate }}
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
    .add-row-icon {
      margin-top: .5em;
      color: #30343f;
    }
    .remove-row-icon {
      margin-top: .5em;
      color: #ff2b1d;
    }
  `]
})
export class AddProductsDialogComponent implements OnInit, AfterViewInit {
  productForm: FormGroup

  private readonly MIN_AMOUNT: number = 1
  private readonly MAX_AMOUNT: number = 99

  private readonly TYPE_NAME = "name"
  private readonly TYPE_AMOUNT = "amount"

  @ViewChildren("inputName") inputNames: QueryList<ElementRef>
  @ViewChildren("inputAmount") inputAmounts: QueryList<ElementRef>

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<AddProductsDialogComponent>,
              private productService: ProductService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      products: this.formBuilder.array([
        this.formBuilder.group({ name: "", amount: "" })
      ])
    })
  }

  ngAfterViewInit(): void {
    this.messageService.displayHelpMessagesInOrder([
        "Voit liikkua kentissä automaattisesti painamalla näppäimistön 'Enter'-painiketta",
        "Jos jätät kohdan 'Määrä' tyhjäksi, annetaan määräksi automaattisesti 1"
    ])
  }

  get products(): FormArray {
    return this.productForm.get("products") as FormArray
  }

  addRow(): void {
    this.products.push(this.formBuilder.group({
      name: "",
      amount: ""
    }))
  }

  deleteProduct(index) {
    this.products.removeAt(index)
  }

  saveProducts(): void {
    const addedProducts: Product[] = this.productForm.value.products
    if (addedProducts.length > 0) {
      const finalProducts: Product[] = addedProducts
        .map(product => this.validateProductAmount(product))
        .filter(product => product.name !== undefined)
        .map(product => {
          return {
            name: product.name,
            amount: product.amount
          }
      })

      if (finalProducts.length === 0) {
        this.messageService.showWarn("addProducts.noProductsAddedNotification", 1000)
      }
      else {
        this.productService.addProducts(finalProducts, this.data.cartId)
          .subscribe(products => this.close(products))
      }
    }
  }

  private validateProductAmount(product: Product): Product {
    if (product.amount === undefined || product.amount === 0) {
      product.amount = this.MIN_AMOUNT
    }
    else if (product.amount > this.MAX_AMOUNT) {
      product.amount = this.MAX_AMOUNT
    }
    return product
  }

  private close(products: Product[]): void {
    this.dialogRef.close(products)
  }

  onFieldEnterPress(index: number, inputType: string): void {
    if (inputType === this.TYPE_NAME) {
      this.handleNextInputFocusName(index)
    }
    else if (inputType === this.TYPE_AMOUNT) {
      this.handleNextInputFocusAmount(index)
    }
    else {
      console.warn("Unknown inputType received '" + inputType + "'")
    }
  }

  private handleNextInputFocusName(index: number): void {
    const nameElementRef: ElementRef = this.inputNames.toArray()[index]
    if (nameElementRef.nativeElement.value) {
      const inputElementRef: ElementRef = this.inputAmounts.toArray()[index]
      inputElementRef.nativeElement.value = ""
      inputElementRef.nativeElement.focus()
    }
  }

  private handleNextInputFocusAmount(index: number): void {
    const amountElementRef: ElementRef = this.inputAmounts.toArray()[index]
    if (!amountElementRef.nativeElement.value) {
      amountElementRef.nativeElement.value = 1
    }

    this.addRow()

    setTimeout(() =>
      this.inputNames.toArray()[index + 1].nativeElement.focus(), 1)
  }
}
