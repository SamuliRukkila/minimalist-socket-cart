import {Injectable} from '@angular/core'
import {HttpClient} from "@angular/common/http"
import {Observable} from "rxjs"
import {JwtRequest} from "../model/jwt/JwtRequest"
import {CookieKeys} from "../model/constants"
import {shareReplay, tap} from "rxjs/operators"
import {JwtResponse} from "../model/jwt/JwtResponse"
import {CookieService} from "ngx-cookie-service"
import {Router} from "@angular/router"
import {LocalCookieService} from "./local-cookie.service"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = "/api/auth"

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: LocalCookieService) {}

  login(username: string, password: string): Observable<JwtResponse> {
    let jwtRequest: JwtRequest = { username: username, password: password }

    return this.http.post<JwtResponse>(
      `${this.url}/login`, jwtRequest)
        .pipe(tap(
          (response: JwtResponse) => this.setSession(response)), shareReplay()
    )
  }

  register(username: string, password: string): Observable<JwtResponse> {
    let jwtRequest: JwtRequest = { username: username, password: password }

    return this.http.post<JwtResponse>(
      `${this.url}/register`, jwtRequest)
      .pipe(tap(
        (response: JwtResponse) => this.setSession(response)), shareReplay()
      )
  }

  public isLoggedIn(): boolean {
    if (!this.cookieService.isPresent(CookieKeys.id) ||
        !this.cookieService.isPresent(CookieKeys.tokenId) ||
        !this.cookieService.isPresent(CookieKeys.username)) {
      return false
    }

    const expirationDate: Date | null = this.getExpiration()
    if (expirationDate === null) {
      return false
    }

    const now: Date = new Date()
    return now < expirationDate
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn()
  }

  logout(): void {
    this.cookieService.clearAuthCookies()
    this.router.navigate(["/"])
  }

  getCookie(cookieKey: string): string {
    return this.cookieService.get(cookieKey)
  }

  private getExpiration(): Date | null {
    const isAvailable: boolean = this.cookieService.isPresent(CookieKeys.expiresAt)
    if (isAvailable) {
      const dateString: string = JSON.parse(this.cookieService.get(CookieKeys.expiresAt))
      return new Date(dateString)
    }

    return null
  }

  private setSession(authResult: JwtResponse) {
    const expiresAt = authResult.expirationDate

    this.cookieService.set(CookieKeys.tokenId, authResult.token)
    this.cookieService.set(CookieKeys.expiresAt, JSON.stringify(expiresAt))
    this.cookieService.set(CookieKeys.username, authResult.user.username)
    this.cookieService.set(CookieKeys.id, String(authResult.user.id))
  }
}
