import {User} from "../user";
import {CartOwnership} from "./cart-ownership";

export interface CartUser {
  user: User
  cartOwnership: CartOwnership
}
