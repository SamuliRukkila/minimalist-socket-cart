import { Injectable } from '@angular/core'
import {Product} from "../model/product"
import {HttpClient, HttpParams} from "@angular/common/http"
import {Observable} from "rxjs"
import {CartSocketService} from "./socket/cart/cart-socket.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url: string = "/api/products"

  constructor(private http: HttpClient,
              private cartSocketService: CartSocketService) {}

  getProducts(cartId: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.url, {
      params: new HttpParams()
        .set("cartId", cartId)
    })
  }

  addProducts(products: Product[], cartId: number): Observable<Product[]> {
    return this.http.post<Product[]>(this.url, products, {
      params: new HttpParams()
        .set("cartId", cartId)
    })
      .pipe(tap(() => this.cartSocketService.productsAddedEvent(cartId)))
  }

  toggleProductIsCollected(product: Product, cartId: number): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${product.id}/collected/toggle`, null)
      .pipe(tap(() => this.cartSocketService.productModifiedEvent(cartId, product)))
  }

  updateProduct(product: Product, cartId: number): Observable<Product> {
    const productId: number = product.id!
    return this.http.put<Product>(`${this.url}/${productId}`, product)
      .pipe(tap(() => this.cartSocketService.productModifiedEvent(cartId, product)))
  }

  deleteProduct(product: Product, cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${product.id}`)
      .pipe(tap(() => this.cartSocketService.productRemovedEvent(cartId, product)))
  }

  getProductAmount(cartId: number): Observable<number> {
    return this.http.get<number>(this.url + "/amount", {
      params: new HttpParams()
        .set("cartId", cartId)
    })
  }

  changeProductIndex(productId: number,
                     cartId: number,
                     previousIndex: number,
                     newIndex: number): Observable<Product[]> {
    return this.http.put<Product[]>(this.url + "/change-index", null, {
        params: new HttpParams()
          .set("productId", productId)
          .set("cartId", cartId)
          .set("previousIndex", previousIndex)
          .set("newIndex", newIndex)
      }
    ).pipe(tap(() => this.cartSocketService.productMovedEvent(cartId)))
  }
}
