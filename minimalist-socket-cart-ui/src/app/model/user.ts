import {Cart} from "./cart/cart"

export interface User {
  id: number
  username: string
  carts?: Cart[]
  isConnectedToCart?: boolean
}
