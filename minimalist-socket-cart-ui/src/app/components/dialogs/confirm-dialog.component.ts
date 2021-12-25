import {Component, Inject, OnInit } from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"

@Component({
  selector: "app-confirm-dialog",
  template: `
    <h2 mat-dialog-title>{{ data.title | translate : data.titleParams }}</h2>
    <mat-dialog-content>
      {{ data.content | translate : data.contentParams }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="cancel()">{{ "cancel" | translate }}</button>
      <button mat-button class="main-button" (click)="confirm()">{{ "yes" | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [
  ]
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmData,
              private dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit(): void {}

  public cancel(): void {
    this.dialogRef.close(false)
  }

  public confirm(): void {
    this.dialogRef.close(true)
  }

}

export interface ConfirmData {
  title: string
  titleParams?: object
  content: string
  contentParams?: object
}
