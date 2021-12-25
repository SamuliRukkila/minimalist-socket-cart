import { Injectable } from '@angular/core'
import {Product} from "../model/product"
import {HttpClient, HttpParams} from "@angular/common/http"
import {Observable} from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url: string = "/api/products"

  constructor(private http: HttpClient) { }

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
  }

  toggleProductIsCollected(productId: number): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${productId}/collected/toggle`, null)
  }

  updateProduct(product: Product): Observable<Product> {
    const productId: number | undefined = product.id
    return this.http.put<Product>(`${this.url}/${productId}`, product)
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${productId}`)
  }

  getProductAmount(cartId: number): Observable<number> {
    return this.http.get<number>(this.url + "/amount", {
      params: new HttpParams()
        .set("cartId", cartId)
    })
  }
}
