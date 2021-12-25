import { Component, OnInit } from "@angular/core"

@Component({
  selector: "bottom-navbar",
  template: `
    <nav class="bottom-nav">
      <a class="bottom-nav__destination" routerLink="carts" routerLinkActive="bottom-nav__destination--active">
        <mat-icon>shopping_cart</mat-icon>
        <span class="bottom-nav__label">{{ "navbar.carts" | translate }}</span>
      </a>

      <a class="bottom-nav__destination" routerLink="products" routerLinkActive="bottom-nav__destination--active">
        <mat-icon>fastfood</mat-icon>
        <span class="bottom-nav__label">{{ "navbar.products" | translate }}</span>
      </a>

      <a class="bottom-nav__destination" routerLink="/profile" routerLinkActive="bottom-nav__destination--active">
        <mat-icon>supervised_user_circle</mat-icon>
        <span class="bottom-nav__label">{{ "navbar.profile" | translate }}</span>
      </a>

      <a class="bottom-nav__destination" routerLink="#" routerLinkActive="bottom-nav__destination--active">
        <mat-icon>info</mat-icon>
        <span class="bottom-nav__label">{{ "navbar.info" | translate }}</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav mat-icon, .bottom-nav span { color: white; }
    .bottom-nav { z-index: 99999; }
  `]
})
export class BottomNavbarComponent implements OnInit {
  ngOnInit(): void {}
}
