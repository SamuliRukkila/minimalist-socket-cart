import {CartUsersKey} from "./cart-users-key";
import {Cart} from "./cart";
import {User} from "../user";
import {CartOwnership} from "./cart-ownership";

export interface CartUsers {
  id: CartUsersKey
  cart: Cart
  user: User
  cartOwnership: CartOwnership
}
