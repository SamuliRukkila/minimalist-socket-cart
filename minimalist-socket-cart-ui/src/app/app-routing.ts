import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {CartListComponent} from "./cart/cart-list/cart-list.component"
import {CartComponent} from "./cart/cart/cart.component"
import {ProfileComponent} from "./profile/profile.component"

const routes: Routes = [
  { path: '', redirectTo: '/carts', pathMatch: 'full' },
  { path: 'carts/:id', component: CartComponent },
  { path: 'carts', component: CartListComponent },
  { path: 'profile', component: ProfileComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting { }
