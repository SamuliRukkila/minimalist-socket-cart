import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core'
import {Product} from "../../model/product"
import {ProductService} from "../../services/product.service"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {ModifyProductDialogComponent} from "../../components/dialogs/product/modify-product-dialog.component"
import {CartAction, CartDialogAction} from "../../model/constants"
import {AddProductsDialogComponent} from "../../components/dialogs/product/add-products-dialog.component"

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnChanges {
  @Input() cartId: number
  @Output() productAmountEvent = new EventEmitter<number>()

  visibleProductColumns: string[] = ['name', 'amount', 'isCollected']

  products: Product[] = []

  constructor(private productService: ProductService,
              private addProductDialog: MatDialog,
              private editDeleteProductDialogComponent: MatDialog) { }

  ngOnInit(): void {
    this.getProducts()
  }

  ngOnChanges(): void {
    this.getProducts()
  }

  openAddProductDialog(): void {
    const cartId: number = this.cartId
    const dialogRef: MatDialogRef<AddProductsDialogComponent> =
      this.addProductDialog.open(AddProductsDialogComponent, { data: { cartId: cartId }})

    dialogRef.afterClosed().subscribe(products => {
      if (products && products.length > 0) {
        this.updateProductTable(products)
      }
    })
  }

  updateProductTable(products: Product[]): void {
    this.products = this.products.concat(products)
    this.updateProductCount(products)
  }

  private getProducts(): void {
    this.productService.getProducts(this.cartId)
      .subscribe(products => {
        this.products = products
        this.updateProductCount(products)
      })
  }

  private updateProductCount(products: Product[]): void {
    this.productAmountEvent.emit(products.length)
  }

  toggleIsProductCollected(row: Product) {
    this.productService.toggleProductIsCollected(row.id!)
      .subscribe(product => {
        const index: number = this.products.findIndex(existingProduct => existingProduct.id === product.id)
        this.products[index].collected = product.collected
      })
  }

  modifyOrDeleteProduct(row: Product) {
    const dialogRef: MatDialogRef<ModifyProductDialogComponent> =
      this.editDeleteProductDialogComponent.open(ModifyProductDialogComponent, { data: { product: row }})

    dialogRef.afterClosed().subscribe((productAction: CartDialogAction) => {
      if (productAction) {
        if (productAction.action === CartAction.UPDATE) {
          this.updateProductInArray(productAction.product!)
        }
        else if (productAction.action === CartAction.DELETE) {
          this.deleteProductInArray(productAction.product!.id!)
        }
        else {
          console.error("Unknown action " + productAction.action + " received")
        }
      }
    })
  }

  private updateProductInArray(updatedProduct: Product): void {
    this.products.forEach(product => {
      if (product.id === updatedProduct.id) {
        product.name = updatedProduct.name
        product.amount = updatedProduct.amount
      }
    })
  }

  private deleteProductInArray(productId: number): void {
    this.products = this.products.filter(product => product.id !== productId)
  }
}
