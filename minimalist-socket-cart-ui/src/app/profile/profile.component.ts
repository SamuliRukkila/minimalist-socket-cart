import {Component, OnInit} from '@angular/core'
import {AuthService} from "../services/auth.service"
import {UserService} from "../services/user.service"
import {CookieKeys} from "../model/constants"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {RegisterFormDialogComponent} from "../components/dialogs/register-form-dialog.component"
import {MessageService} from "../services/message.service"
import {FriendshipService} from "../services/friendship.service"
import {Friendship} from "../model/friendship"
import {CookieService} from "ngx-cookie-service"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoggedIn: boolean = false
  username: string

  friendships: Friendship[] = []
  requestSentFriendships: Friendship[] = []
  requestReceivedFriendships: Friendship[] = []

  constructor(private authenticationService: AuthService,
              private userService: UserService,
              private friendshipService: FriendshipService,
              private messageService: MessageService,
              private cookieService: CookieService,
              private registerFormDialogComponent: MatDialog) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isLoggedIn()
    if (this.isLoggedIn) {
      this.username = this.authenticationService.getCookie(CookieKeys.username)
    }
  }

  openRegisterDialog(): void {
    this.registerFormDialogComponent.open(RegisterFormDialogComponent)
  }

  logout(): void {
    this.authenticationService.logout()
  }
}
