import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {FormControl, FormGroup} from "@angular/forms"
import {AuthService} from "../../services/auth.service"
import {first} from "rxjs/operators"
import {Router} from "@angular/router"
import {MessageService} from "../../services/message.service"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"

@Component({
  selector: 'credentials-form',
  templateUrl: './credentials-form.component.html',
  styleUrls: ['./credentials-form.component.scss']
})
export class CredentialsFormComponent implements OnInit {
  @Input() register: boolean

  error: string = ""
  loading: boolean = false

  form: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  })

  @Input() title: string = ""

  constructor(private authenticationService: AuthService,
              private router: Router,
              private messageService: MessageService,
              private dialogRef: MatDialog) {
  }

  ngOnInit(): void {
  }

  sendCredentials(): void {
    if (this.form.invalid) {
      return
    }

    if (this.register) {
      this.doRegister()
    }
    else {
      this.doLogin()
    }
  }

  private doRegister(): void {
    this.authenticationService.register(this.form.value.username, this.form.value.password)
      .pipe(first())
      .subscribe(data => {
          this.dialogRef.closeAll()
          this.messageService.showInfo("Tervetuloa, " + data.user.username + "! " +
            "Aloita käyttö luomalla uusi ostoskori + -napista", 4000)
          this.router.navigate(['/'])
        },
          error => console.error(error))
  }

  private doLogin(): void {
    this.authenticationService.login(this.form.value.username, this.form.value.password)
      .pipe(first())
      .subscribe(data => {
          this.messageService.showInfo("Tervetuloa, " + data.user.username + "!", 1000)
          this.router.navigate(['/'])
        },
          error => console.error(error))
  }
}
