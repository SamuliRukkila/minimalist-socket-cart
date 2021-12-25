import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpStatusCode
} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {catchError, retry} from "rxjs/operators"
import {MessageService} from "../../services/message.service"
import {AuthService} from "../../services/auth.service"
import {Router} from "@angular/router"
import {LocalCookieService} from "../../services/local-cookie.service"

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private cookieService: LocalCookieService,
              private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          // Client side
          if (error.error instanceof ErrorEvent) {
            console.error(error.error.message)
          }
          // Server side
          else {
            this.handleServerError(error)
          }
          return throwError(error)
        })
      )
  }

  private handleServerError(error: HttpErrorResponse): void {
    const usernameAlreadyTakenError: boolean =
      error.status === HttpStatusCode.Conflict && error.url!.endsWith("register")
    if (usernameAlreadyTakenError) {
      this.handleUserNameAlreadyTaken()
    }

    if (error.status === HttpStatusCode.Unauthorized) {
      this.handleUnauthorized()
    }
  }

  private handleUserNameAlreadyTaken(): void {
    this.messageService.showError("error.usernameAlreadyTaken", 1500)
  }

  private handleUnauthorized(): void {
    this.cookieService.clearAuthCookies()
    this.messageService.showError("error.promptLogin", 1500)
    this.router.navigate(["profile"])
    return
  }
}
