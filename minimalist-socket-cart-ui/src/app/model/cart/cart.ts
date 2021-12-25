import {CartStatus} from "../status/cartStatus"
import {CartUsers} from "./cart-users";

export interface Cart {
  id: number
  name: string
  status: CartStatus
  amountOfProducts: number
  users: CartUsers[]
  createdAt: Date
}
