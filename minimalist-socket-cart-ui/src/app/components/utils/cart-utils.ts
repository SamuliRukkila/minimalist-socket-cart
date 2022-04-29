import {Cart} from "../../model/cart/cart";
import {User} from "../../model/user";
import {CartOwnership} from "../../model/cart/cart-ownership";
import {CartUser} from "../../model/cart/cart-user";

export class CartUtils {

  public static currentUserIsOwnerOfCart(cart: Cart, user: User): boolean {
    return cart.cartUsers
      .filter((cartUser: CartUser) => CartOwnership[cartUser.cartOwnership] === CartOwnership.OWNER)
      .some((cartUser: CartUser) => cartUser.user.id === user.id)
  }
}
