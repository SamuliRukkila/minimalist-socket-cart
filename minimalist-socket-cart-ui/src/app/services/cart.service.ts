import {Injectable} from '@angular/core'
import {Cart} from "../model/cart/cart"
import {CartStatus} from "../model/status/cartStatus"
import {User} from "../model/user"
import {HttpClient, HttpParams} from "@angular/common/http"
import {Observable} from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url: string = "/api/carts"

  constructor(private http: HttpClient) { }

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.url)
  }

  createCart(cartName: string): Observable<Cart> {
    return this.http.post<Cart>(this.url, null, {
      params: new HttpParams()
        .set("name", cartName)
    })
  }

  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.url}/${id}`)
  }

  deleteCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  updateCart(cart: Cart): Observable<Cart> {
    const id: number = cart.id
    return this.http.put<Cart>(`${this.url}/${id}`, cart)
  }

  changeCartStatus(id: number, newStatus: CartStatus): Observable<Cart> {
    return this.http.put<Cart>(`${this.url}/${id}/change-status`, null, {
      params: new HttpParams()
        .set("status", newStatus)
    })
  }

  addFriendToCart(cartId: number, friendId: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.url}/${cartId}/add-friend/${friendId}`, null)
  }
}
