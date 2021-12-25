import { Injectable } from '@angular/core'
import {HttpClient, HttpParams} from "@angular/common/http"
import {Observable} from "rxjs"
import {User} from "../model/user"
import {Friendship} from "../model/friendship"
import {not} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  url: string = "/api/friendship"

  constructor(private http: HttpClient) {}

  getFriends(notInCartId?: number): Observable<User[]> {
    const params: any = {
      "notInCartId": notInCartId
    }
    return this.http.get<User[]>(this.url + "/friends",
      { params: params }
    )
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
