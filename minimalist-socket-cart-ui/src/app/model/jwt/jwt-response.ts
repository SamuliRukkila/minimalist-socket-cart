import {User} from "../user"

export interface JwtResponse {
  token: string
  expirationDate: Date
  user: User
}
