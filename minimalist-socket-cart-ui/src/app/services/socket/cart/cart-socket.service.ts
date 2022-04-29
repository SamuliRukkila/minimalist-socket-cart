import { Injectable } from '@angular/core';
import {Cart} from "../../../model/cart/cart";

import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import {Message} from "@stomp/stompjs";
import {Subject} from "rxjs";
import {SocketServiceUtils} from "../socket-service-utils";
import {LocalCookieService} from "../../local-cookie.service";
import {CartSocketMessageContainer, ProductSocketMessageContainer} from "../../../model/socket-message-containers";
import {CookieKeys} from "../../../model/constants";
import {Product} from "../../../model/product";

@Injectable({
  providedIn: "root"
})
export class CartSocketService extends RxStomp {

  private path: string = "carts"

  nameUpdatedSubject: Subject<CartSocketMessageContainer> = new Subject<CartSocketMessageContainer>()
  statusUpdatedSubject: Subject<CartSocketMessageContainer> = new Subject<CartSocketMessageContainer>()
  cartDeletedSubject: Subject<void> = new Subject<void>()

  productsAddedSubject: Subject<void> = new Subject<void>()
  productRemovedSubject: Subject<ProductSocketMessageContainer> = new Subject<ProductSocketMessageContainer>()
  productModifiedSubject: Subject<ProductSocketMessageContainer> = new Subject<ProductSocketMessageContainer>()
  productMovedSubject: Subject<void> = new Subject<void>()

  constructor(private localCookieService: LocalCookieService) {
    super();
  }

  connect(cartId: number): void {
    const config: RxStompConfig = SocketServiceUtils.generateConfig(this.path, cartId, false)
    this.configure(config)

    this.activate()

    if (this.active) {
      this.configureWebSocketEndpoints(cartId)
    }
  }

  private configureWebSocketEndpoints(cartId: number): void {
    this.watch(`/${this.path}/${cartId}/name-updated-listener`)
        .subscribe((message: Message) =>
          this.forwardMessageToSubject(message, this.nameUpdatedSubject))

    this.watch(`/${this.path}/${cartId}/status-updated-listener`)
        .subscribe((message: Message) =>
          this.forwardMessageToSubject(message, this.statusUpdatedSubject))

    this.watch(`/${this.path}/${cartId}/deleted-listener`)
        .subscribe((message: Message) =>
          this.forwardMessageToSubject(message, this.cartDeletedSubject))

    this.watch(`/${this.path}/${cartId}/products-added-listener`)
        .subscribe((message: Message) =>
          this.forwardMessageToSubject(message, this.productsAddedSubject))

    this.watch(`/${this.path}/${cartId}/product-removed-listener`)
      .subscribe((message: Message) =>
        this.forwardMessageToSubject(message, this.productsAddedSubject))

    this.watch(`/${this.path}/${cartId}/product-modified-listener`)
      .subscribe((message: Message) =>
        this.forwardMessageToSubject(message, this.productsAddedSubject))

    this.watch(`/${this.path}/${cartId}/product-moved-listener`)
      .subscribe((message: Message) =>
        this.forwardMessageToSubject(message, this.productsAddedSubject))
  }

  private forwardMessageToSubject(message: Message, subject: Subject<any>): void {
    const body: CartSocketMessageContainer | ProductSocketMessageContainer = JSON.parse(message.body)
    if (!this.messageIsSentByCurrentUser(body)) {
      subject.next(body)
    }
  }

  private messageIsSentByCurrentUser(body: CartSocketMessageContainer | ProductSocketMessageContainer): boolean {
    return body.user && body.user.id === Number(this.localCookieService.get(CookieKeys.id))
  }

  disconnect(): void {
    super.deactivate()
      .then(() => console.debug("Connection disconnected"))
      .catch((error: unknown) => console.error("Error while disconnecting: ", error))
  }

  cartNameUpdatedEvent(cart: Cart): void {
    this.publishMessage("name-updated", this.createCartMessageContainer(cart))
  }

  cartStatusUpdatedEvent(cart: Cart): void {
    this.publishMessage("status-updated", this.createCartMessageContainer(cart))
  }

  cartDeletedEvent(cart: Cart): void {
    this.publishMessage("deleted", this.createCartMessageContainer(cart))
  }

  productsAddedEvent(cartId: number): void {
    this.publishMessage("products-added", this.createProductMessageContainer(cartId))
  }

  productRemovedEvent(cartId: number, product: Product): void {
    this.publishMessage("product-removed", this.createProductMessageContainer(cartId, product))
  }

  productModifiedEvent(cartId: number, product: Product): void {
    this.publishMessage("product-modified", this.createProductMessageContainer(cartId, product))
  }

  productMovedEvent(cartId: number): void {
    this.publishMessage("product-moved", this.createProductMessageContainer(cartId))
  }

  publishMessage(path: string, messageContainer: CartSocketMessageContainer | ProductSocketMessageContainer): void {
    if (!this.connected()) {
      console.warn(`Trying to publish a message to path ${path} but no connection was present`)
    }

    this.publish({
      destination: `/${this.path}/${messageContainer.cartId}/${path}`,
      body: JSON.stringify(messageContainer)
    })
  }

  private createCartMessageContainer(cart: Cart): CartSocketMessageContainer {
    return new CartSocketMessageContainer(this.localCookieService.getCurrentUser(), cart)
  }

  private createProductMessageContainer(cartId: number, product?: Product): ProductSocketMessageContainer {
    return new ProductSocketMessageContainer(this.localCookieService.getCurrentUser(), cartId, product)
  }
}
