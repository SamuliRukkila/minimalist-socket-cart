import {RxStompConfig, RxStompState} from "@stomp/rx-stomp";
import {environment} from "../../../environments/environment";

export class SocketServiceUtils {

  /** Creates a basic WebSocket connection to path and identifier */
  public static generateConfig(path: string, identifier: number, debug: boolean = false): RxStompConfig {
    const stompConfig: RxStompConfig = {}

    stompConfig.brokerURL = `${environment.socketUrl}/${path}/${identifier}/connect`

    console.debug("Initiating a websocket-connection to url: '" + stompConfig.brokerURL + "'")

    if (debug) {
      stompConfig.debug = (msg: string): void => console.debug(new Date(), msg)
    }
    return stompConfig
  }

  public static isConnected(state: string): boolean {
    return RxStompState.OPEN.toString() === state
  }

  public static isDisconnected(state: string): boolean {
    return RxStompState.CLOSED.toString() === state
  }
}
