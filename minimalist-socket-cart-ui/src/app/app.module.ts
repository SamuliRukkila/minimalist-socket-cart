import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

import {AppRouting} from './app-routing'
import {AppComponent} from './app.component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {BottomNavbarComponent} from './bottom-navbar/bottom-navbar.component'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from "@angular/material/card"
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http"
import {CartListComponent} from "./cart/cart-list/cart-list.component"
import {CartComponent} from "./cart/cart/cart.component"
import {DynamicToolbarComponent} from './components/dynamic-toolbar/dynamic-toolbar.component'
import {CartStatusPipe} from "./components/pipes/cart-status-pipe.pipe"
import {ProfileComponent} from './profile/profile.component'
import {CartService} from "./services/cart.service"
import {FineliService} from "./services/fineli.service"
import {DragDropModule} from "@angular/cdk/drag-drop"
import {StickyButtonComponent} from './components/ui/sticky-button.component'
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog"
import {AddCartDialogComponent} from './components/dialogs/cart/add-cart-dialog.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {ProductsListComponent} from './products/product-table/products-list.component'
import {MatTableModule} from "@angular/material/table"
import {AddProductsDialogComponent} from './components/dialogs/product/add-products-dialog.component'
import {CookieService} from "ngx-cookie-service"
import {AuthService} from "./services/auth.service"
import {CredentialsFormComponent} from './profile/credentials-form/credentials-form.component'
import {AuthInterceptor} from "./components/interceptors/auth-interceptor"
import {MatSortModule} from "@angular/material/sort"
import {MatRippleModule} from "@angular/material/core"
import {NgxLongPress2Module} from "ngx-long-press2"
import {ModifyProductDialogComponent} from './components/dialogs/product/modify-product-dialog.component'
import {ModifyCartDialogComponent} from './components/dialogs/cart/modify-cart-dialog.component'
import {StatusLocalizePipe} from './components/pipes/status-localizer.pipe'
import {ProductCollectionIconPipe} from './components/pipes/product-is-collected.pipe'
import {RegisterFormDialogComponent} from './components/dialogs/register-form-dialog.component'
import {ErrorHandlingInterceptor} from "./components/interceptors/error-handling.interceptor"
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatListModule} from "@angular/material/list"
import {FriendshipStatusPipe} from './components/pipes/friendship-status-localizer.pipe'
import {MatExpansionModule} from "@angular/material/expansion"
import {TranslateLoader, TranslateModule, TranslateModuleConfig} from "@ngx-translate/core"
import {TranslateHttpLoader} from "@ngx-translate/http-loader"
import {CartMetaInformationComponent} from './cart/cart-meta-information.component'
import {MatMenuModule} from "@angular/material/menu"
import {SendFriendRequestDialogComponent} from './components/dialogs/friend/send-friend-request-dialog.component'
import {
  ChooseUserListComponent
} from './components/dialogs/friend/choose-user-list.component'
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner"
import {MatTabsModule} from "@angular/material/tabs"
import { GeneralUserListComponent } from './profile/friendship/general-user-list.component'
import { AddFriendToCartDialogComponent } from './components/dialogs/friend/add-friend-to-cart-dialog.component'
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog.component'
import { FriendshipPanelComponent } from './profile/friendship/friendship-panel.component'
import {MatBadgeModule} from "@angular/material/badge";
import { NameTagsComponent } from './components/ui/name-tags.component'
import {RandomcolorModule} from "angular-randomcolor"
import { CartOptions } from './cart/cart/cart-options';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";

const translateConfig: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
}

@NgModule({
  declarations: [
    AppComponent,
    BottomNavbarComponent,
    CartComponent,
    CartListComponent,
    DynamicToolbarComponent,
    CartStatusPipe,
    ProfileComponent,
    StickyButtonComponent,
    AddCartDialogComponent,
    ProductsListComponent,
    AddProductsDialogComponent,
    CredentialsFormComponent,
    ModifyProductDialogComponent,
    ModifyCartDialogComponent,
    StatusLocalizePipe,
    ProductCollectionIconPipe,
    RegisterFormDialogComponent,
    FriendshipStatusPipe,
    CartMetaInformationComponent,
    SendFriendRequestDialogComponent,
    ChooseUserListComponent,
    GeneralUserListComponent,
    AddFriendToCartDialogComponent,
    ConfirmDialogComponent,
    FriendshipPanelComponent,
    NameTagsComponent,
    CartOptions,
  ],
    imports: [
        BrowserModule,
        AppRouting,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        DragDropModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSortModule,
        MatRippleModule,
        NgxLongPress2Module,
        MatSnackBarModule,
        MatListModule,
        MatExpansionModule,
        TranslateModule.forRoot(translateConfig),
        MatMenuModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatBadgeModule,
        RandomcolorModule,
        MatGridListModule,
        MatSlideToggleModule,
        MatTooltipModule,
    ],
  providers: [
    CartService,
    FineliService,
    CookieService,
    AuthService,
    MatBottomSheet,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddCartDialogComponent,
    SendFriendRequestDialogComponent,
    AddFriendToCartDialogComponent,
    ModifyCartDialogComponent,
    AddProductsDialogComponent,
    ModifyProductDialogComponent,
    RegisterFormDialogComponent
  ]
})
export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http)
}
