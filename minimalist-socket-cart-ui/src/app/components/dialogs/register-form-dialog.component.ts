import { Component, OnInit } from '@angular/core'
import {AuthService} from "../../services/auth.service"
import {MatDialogRef} from "@angular/material/dialog"

@Component({
  selector: 'app-register-form-dialog',
  template: `
    <div style="width: 16em">
      <credentials-form
        [register]="true"
        [title]="'register.title' | translate">
      </credentials-form>
    </div>
  `,
  styles: [`

  `]
})
export class RegisterFormDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RegisterFormDialogComponent>,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close()
  }
}
