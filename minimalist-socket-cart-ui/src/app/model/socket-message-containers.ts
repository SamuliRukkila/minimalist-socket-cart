import {User} from "./user";
import {Cart} from "./cart/cart";
import {Product} from "./product";

export class CartSocketMessageContainer {
  user: User
  cart: Cart
  cartId: number

  constructor(user: User, cart: Cart) {
    this.user = user
    this.cart = cart
    this.cartId = cart.id
  }
}

export class ProductSocketMessageContainer {
  user: User
  cartId: number
  product?: Product

  constructor(user: User, cartId: number, product?: Product) {
    this.user = user
    this.cartId = cartId
    this.product = product
  }
}
