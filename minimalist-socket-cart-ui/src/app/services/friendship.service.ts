import { Injectable } from '@angular/core'
import {HttpClient, HttpParams} from "@angular/common/http"
import {Observable} from "rxjs"
import {User} from "../model/user"
import {Friendship} from "../model/friendship"

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  url: string = "/api/friendship"

  constructor(private http: HttpClient) {}

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(this.url + "/friends")
  }

  findFriendsNotInCart(cartId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/friends/not-in-cart/${cartId}`)
  }

  findAllFriendships(): Observable<Friendship[]> {
    return this.http.get<Friendship[]>(this.url)
  }

  sendFriendRequest(friendId: number): Observable<User> {
    return this.http.post<User>(`${this.url}/request/${friendId}`, null)
  }

  deleteFriendRequest(friendId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/request/${friendId}`)
  }

  acceptFriendRequest(friendId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/request/accept/${friendId}`, null)
  }

  rejectFriendshipRequest(friendId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/request/reject/${friendId}`, null)
  }

  removeFriendship(friendId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${friendId}`)
  }
}
