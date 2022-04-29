import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core'
import {User} from "../../../model/user"
import {Subject} from "rxjs"
import {debounceTime, distinctUntilChanged} from 'rxjs/operators'
import {UserService} from "../../../services/user.service"

@Component({
  selector: 'app-choose-user-list',
  template: `
    <div class="container">
      <div class="upper-part-container">
        <h2 *ngIf="title" mat-dialog-title class="dialog-title">{{ title | translate }}</h2>

        <mat-dialog-content>
          <mat-table [dataSource]="userChoiceList" class="mat-elevation-z7 username-table-container">

            <ng-container matColumnDef="username">
              <mat-header-cell *matHeaderCellDef>
                <span *ngIf="userChoiceList.length > 0 else displayGeneralUserTableList">
                  {{ foundUserAmountText | translate : { userAmount: userChoiceList.length } }}
                </span>
                <ng-template #displayGeneralUserTableList>
                  {{ userTableRowTitle | translate }}
                </ng-template>
              </mat-header-cell>
              <mat-cell *matCellDef="let user" [ngClass]="{ 'isSelected': user.id === selectedUser?.id }">
                {{ user.username }}
              </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="['username'] sticky: true"></mat-header-row>
            <mat-row matRipple
                     class="username-row"
                     (click)="selectUser(row)"
                     *matRowDef="let row columns: ['username']">
            </mat-row>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" colspan="4">
                <span *ngIf="loading else displayMessages">
                  <mat-spinner diameter="25"></mat-spinner>
                </span>
                <ng-template #displayMessages>
                  <span *ngIf="displayNoUsersFound else displaySearchHelpMessage">
                    {{ noUsersFoundText | translate }}
                  </span>
                  <ng-template #displaySearchHelpMessage>
                    {{ helpSearchMessage | translate }}
                  </ng-template>
                </ng-template>
              </td>

            </tr>
          </mat-table>
        </mat-dialog-content>
      </div>

      <div class="spacer"></div>

      <div class="bottom-part-container">
        <mat-form-field>
          <mat-label>{{ searchUserText | translate }}</mat-label>
          <input type="search" matInput (keyup)="$searchWord.next($event.target['value'])"
                 [placeholder]="'friends.searchUserPlaceholder' | translate" autocomplete="off">
        </mat-form-field>

        <mat-dialog-actions>
          <button mat-button mat-dialog-close="">{{ "friends.close" | translate }}</button>
          <button mat-button class="mat-raised-button main-button"
                  (click)="onSubmit()" [disabled]="selectedUser === undefined">
            {{ onSubmitText | translate }}
          </button>
        </mat-dialog-actions>
      </div>
    </div>
  `,
  styles: [`
      .cart-container {
          height: 100%;
          display: flex;
          flex-direction: column;
      }

      .upper-part-container {
          flex-grow: 100;
      }

      .bottom-part-container {
          padding: .8em;
      }

      .bottom-part-container mat-form-field {
          width: 100%;
      }

      .spacer {
          flex-grow: 1;
      }

      .mat-header-row {
          min-height: 2.5em;
      }

      .mat-row {
          min-height: 2.5em;
      }

      .no-data-cell {
          padding: .8em;
      }

      .username-table-container {
          max-height: 46vh;
          overflow: auto;
      }

      .mat-header-cell {
          background-color: #30343f;
          color: #e5f4e3;
      }

      .isSelected {
          background-color: #c29695;
          color: #e5f4e3;
      }
  `]
})
export class ChooseUserListComponent implements OnChanges {

  @Input() title: string
  @Input() searchUserText: string
  @Input() userTableRowTitle: string
  @Input() foundUserAmountText: string
  @Input() noUsersFoundText: string
  @Input() helpSearchMessage: string
  @Input() onSubmitText: string

  @Input() showSearchbar: boolean = true
  @Input() searchOnlyFromProvidedList: boolean = false
  @Input() originalUserChoiceList: User[] = []
  @Input() userChoiceList: User[] = []

  @Output() submit: EventEmitter<User> = new EventEmitter<User>()

  $searchWord: Subject<string> = new Subject<string>()
  loading: boolean = false
  selectedUser: User

  displayNoUsersFound: boolean = false

  constructor(private userService: UserService) {
    this.initSearchWordSubjectHandler()
  }

  ngOnChanges(): void {}

  private initSearchWordSubjectHandler(): void {
    this.$searchWord.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchWord => {
      if (searchWord.trim().length === 0) {
        if (this.searchOnlyFromProvidedList) {
          this.userChoiceList = this.originalUserChoiceList
        }
        else {
          this.userChoiceList = []
        }
        this.displayNoUsersFound = false
      }
      else {
        this.loading = true
        this.searchUsers(searchWord)
      }
    })
  }

  private searchUsers(searchWord: any): void {
    if (this.searchOnlyFromProvidedList) {
      this.searchUsersInternally(searchWord)
    }
    else {
      this.searchUsersExternally(searchWord)
    }
  }

  private searchUsersExternally(searchWord: any): void {
    this.userService.searchUsers(searchWord).subscribe((users: User[]) => {
        this.userChoiceList = users
        this.loading = false
        if (users.length === 0) {
          this.displayNoUsersFound = true
        }
      },
      (error: unknown) => console.error(error),
      () => this.loading = false
    )
  }

  private searchUsersInternally(searchWord: string): void {
    this.userChoiceList = this.originalUserChoiceList
      .filter(user => user.username.toLowerCase().includes(searchWord.toLowerCase()))
    this.loading = false
    if (this.userChoiceList.length === 0) {
      this.displayNoUsersFound = true
    }
  }

  selectUser(user: User): void {
    this.selectedUser = user
  }

  onSubmit(): void {
    this.submit.emit(this.selectedUser)
  }
}
