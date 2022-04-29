import {Injectable} from '@angular/core'
import {Cart} from "../model/cart/cart"
import {CartStatus} from "../model/status/cart-status"
import {HttpClient, HttpParams} from "@angular/common/http"
import {Observable} from "rxjs"
import {CartSocketService} from "./socket/cart/cart-socket.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url: string = "/api/carts"

  constructor(private http: HttpClient,
              private cartSocketService: CartSocketService) { }

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.url)
  }

  createCart(cartName: string): Observable<Cart> {
    return this.http.post<Cart>(this.url, null, {
      params: new HttpParams()
        .set("name", cartName)
    })
  }

  getCart(id: string | number): Observable<Cart> {
    return this.http.get<Cart>(`${this.url}/${id}`)
  }

  deleteCart(cart: Cart): Observable<void> {
    return this.http.delete<void>(`${this.url}/${cart.id}`)
      .pipe(tap(() => this.cartSocketService.cartDeletedEvent(cart)))
  }

  updateCart(cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.url}/${cart.id}`, cart)
      .pipe(tap((cart: Cart) => this.cartSocketService.cartNameUpdatedEvent(cart)))
  }

  updateCartStatus(cartId: number, newStatus: CartStatus): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.url}/${cartId}/change-status`,
      null, {
        params: new HttpParams().set("status", newStatus)
    })
      .pipe(tap((cart: Cart) => this.cartSocketService.cartStatusUpdatedEvent(cart)))
  }

  addFriendToCart(cartId: number, friendId: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.url}/${cartId}/add-friend/${friendId}`, null)
  }
}
