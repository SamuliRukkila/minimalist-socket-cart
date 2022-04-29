export interface Product {
  id?: number
  name: string
  amount: number
  collected?: boolean
  cartId?: number
  index?: number

  isBeingProcessed?: boolean
}
