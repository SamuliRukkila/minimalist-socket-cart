import {Product} from "./product"
import {Cart} from "./cart/cart"

export class CookieKeys {
  public static tokenId: string = "token_id"
  public static expiresAt: string = "expires_at"
  public static username: string = "username"
  public static id: string = "id"
}

export interface CartDialogAction {
  product?: Product
  cart?: Cart
  action: CartAction
}

export enum CartAction {
  UPDATE, DELETE
}

export class SnackBarCookieMessageKeys {
  public static autoCreateCartHint: string = "auto_create_cart_hint"
  public static createProductsHints: string = "create_products_hints"
}
