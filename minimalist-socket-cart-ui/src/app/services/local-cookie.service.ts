import { Injectable } from '@angular/core'
import {CookieService} from "ngx-cookie-service"
import {CookieKeys} from "../model/constants"
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class LocalCookieService {

  constructor(private cookieService: CookieService) {}

  get(name: string): string {
    return this.cookieService.get(name)
  }

  getBoolean(name: string): boolean {
    const value: string = this.cookieService.get(name)
    if (!value) {
      return false
    }
    return value === "true"
  }

  set(name: string, value: string): void {
    this.cookieService.set(name, value)
  }

  setBoolean(name: string, value: any): void {
    this.set(name, String(value))
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

  getCurrentUser(): User {
    return {
      id: Number(this.get(CookieKeys.id)),
      username: this.get(CookieKeys.username)
    }
  }
}
