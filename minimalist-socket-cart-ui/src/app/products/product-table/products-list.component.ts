import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core'
import {Product} from "../../model/product"
import {ProductService} from "../../services/product.service"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {ModifyProductDialogComponent} from "../../components/dialogs/product/modify-product-dialog.component"
import {CartAction, CartDialogAction} from "../../model/constants"
import {AddProductsDialogComponent} from "../../components/dialogs/product/add-products-dialog.component"
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {CartSocketService} from "../../services/socket/cart/cart-socket.service";
import {ProductSocketMessageContainer} from "../../model/socket-message-containers";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnChanges {

  @Input() cartId: number
  @Input() canAddProducts: boolean
  @Input() hideCollectedProductRows: boolean
  @Input() socketService: CartSocketService
  @Output() productAmountEvent = new EventEmitter<number>()

  areProductsLoading: boolean
  dragEnabled: boolean

  products: Product[] = []

  productsAmount: number = 0
  collectedProductsAmount: number = 0

  visibleProductColumns: string[] = ["name", "amount", "isCollected", "dragHandle"]

  constructor(private productService: ProductService,
              private addProductDialog: MatDialog,
              private editDeleteProductDialogComponent: MatDialog) {}

  ngOnChanges(): void {
    this.subscribeToSocketMessages()
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

  onProductMove(event: CdkDragDrop<any, any>) {
    const movedProduct: Product = this.products[event.previousIndex]
    if (!movedProduct) {
      console.error("Tried to move product of index " + event.previousIndex + " but it was not found")
      return
    }
    else if (event.previousIndex === event.currentIndex) {
      return
    }

    movedProduct.isBeingProcessed = true

    this.productService.changeProductIndex(
      movedProduct.id!, this.cartId, event.previousIndex, event.currentIndex)
        .subscribe(
          (reIndexedProducts: Product[]) => this.products = this.sortAndFilterProducts(reIndexedProducts),
          () => movedProduct.isBeingProcessed = false)
  }

  private subscribeToSocketMessages(): void {
    this.socketService.productsAddedSubject.subscribe(() => this.getProducts())

    this.socketService.productRemovedSubject.subscribe(
      (container: ProductSocketMessageContainer) => this.removeProductFromList(container.product!.id!))

    this.socketService.productModifiedSubject.subscribe(
      (container: ProductSocketMessageContainer) => this.updateProductInList(container.product!))

    this.socketService.productMovedSubject.subscribe(() => this.getProducts())
  }

  private getProducts(): void {
    this.productService.getProducts(this.cartId)
      .subscribe((products: Product[]) => this.setProducts(products),
      () => {},
      () => this.areProductsLoading = false
      )
  }

  private setProducts(products: Product[]): void {
    if (this.containsNewProducts(products)) {
      this.products = []
      this.areProductsLoading = true

      products = this.sortAndFilterProducts(products)

      this.products = products
      this.updateProductCount(products)
    }
  }

  private sortAndFilterProducts(products: Product[]): Product[] {
    if (this.hideCollectedProductRows) {
      products = products.filter(product => !product.collected)
    }
    return products.sort((p1, p2) => p1.index! - p2.index!)
  }

  private containsNewProducts(products: Product[]): boolean {
    return this.products.length === 0 ||
           products.every((value: Product, index: number) => value !== this.products[index])
  }

  private updateProductCount(products: Product[]): void {
    this.productsAmount = products.length
    this.collectedProductsAmount = products.filter(product => product.collected).length

    this.productAmountEvent.emit(products.length)
  }

  toggleIsProductCollected(product: Product) {
    // Apply collected-toggle immediately for better usability. Toggles back if error occurs
    product.collected = !product.collected
    this.updateProductCount(this.products)

    this.productService.toggleProductIsCollected(product, this.cartId)
      .subscribe((product: Product) => {
        if (this.hideCollectedProductRows) {
          this.products = this.products.filter(existingProduct => existingProduct.id !== product.id)
        }
      },
      () => {
        product.collected = !product.collected
        this.updateProductCount(this.products)
      })
  }

  modifyOrDeleteProduct(row: Product) {
    // Disable modification if in drag-process
    if (this.dragEnabled) {
      return
    }

    const dialogRef: MatDialogRef<ModifyProductDialogComponent> =
      this.editDeleteProductDialogComponent.open(
        ModifyProductDialogComponent, { data: { product: row, cartId: this.cartId }})

    dialogRef.afterClosed().subscribe((productAction: CartDialogAction) => {
      if (productAction) {
        if (productAction.action === CartAction.UPDATE) {
          this.updateProductInList(productAction.product!)
        }
        else if (productAction.action === CartAction.DELETE) {
          this.removeProductFromList(productAction.product!.id!)
        }
        else {
          console.error("Unknown action " + productAction.action + " received")
        }
      }
    })
  }

  private updateProductInList(updatedProduct: Product): void {
    this.products.forEach(product => {
      if (product.id === updatedProduct.id) {
        product.name = updatedProduct.name
        product.amount = updatedProduct.amount
        product.collected = updatedProduct.collected
      }
    })
  }

  private removeProductFromList(productId: number): void {
    this.products = this.products.filter(product => product.id !== productId)
    this.updateProductCount(this.products)
  }
}
