import {CartStatus} from "../status/cart-status"
import {CartUser} from "./cart-user";

export interface Cart {
  id: number
  name: string
  status: CartStatus
  amountOfProducts: number
  cartUsers: CartUser[]
  createdAt: Date
}
