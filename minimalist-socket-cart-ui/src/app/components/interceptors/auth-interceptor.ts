import { Injectable } from '@angular/core'
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http"
import {Observable} from "rxjs"
import {AuthService} from "../../services/auth.service"
import {CookieKeys} from "../../model/constants"
import {Router} from "@angular/router"
import {LocalCookieService} from "../../services/local-cookie.service"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService,
              private cookieService: LocalCookieService,
              private router: Router) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url: string = httpRequest.url

    const isNonAuthenticatedUrl: boolean =
      url.endsWith("/auth/login") || url.endsWith("/auth/register")
    if (isNonAuthenticatedUrl) {
      return next.handle(httpRequest)
    }

    this.checkForUnauthorizedRequest()

    const tokenId: string = this.generateAuthorizationTokenIdHeader()

    return next.handle(httpRequest.clone({
      setHeaders: {
        "Authorization": tokenId
      }
    }))
  }

  private generateAuthorizationTokenIdHeader(): string {
    const tokenId: string = this.authenticationService.getCookie(CookieKeys.tokenId)
    const bearerKey: string = "Bearer "
    return bearerKey + tokenId
  }

  private checkForUnauthorizedRequest(): void {
    if (!this.authenticationService.isLoggedIn()) {
      console.warn("Unauthorized access")
      this.cookieService.clearAuthCookies()
      this.router.navigate(['/profile'])
      return
    }
  }
}
