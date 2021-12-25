import { Injectable } from '@angular/core'
import {CookieService} from "ngx-cookie-service"
import {CookieKeys} from "../model/constants"

@Injectable({
  providedIn: 'root'
})
export class LocalCookieService {

  constructor(private cookieService: CookieService) {}

  get(name: string): string {
    return this.cookieService.get(name)
  }

  set(name: string, value: string): void {
    this.cookieService.set(name, value)
  }

  clearAuthCookies(): void {
    this.cookieService.delete(CookieKeys.tokenId)
    this.cookieService.delete(CookieKeys.expiresAt)
    this.cookieService.delete(CookieKeys.username)
    this.cookieService.delete(CookieKeys.id)
  }

  isPresent(name: string): boolean {
    return this.cookieService.check(name)
  }
}
