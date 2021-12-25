import { Injectable } from '@angular/core'
import {Observable} from "rxjs"
import {HttpClient, HttpParams} from "@angular/common/http"
import {User} from "../model/user"


@Injectable({
  providedIn: "root"
})
export class UserService {
  url: string = "/api/users"

  constructor(private http: HttpClient) { }

  doesUserExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + "/exists", {
      params: new HttpParams()
        .set("username", username)
    })
  }

  findAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url)
  }

  findAllNonFriendUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + "/non-friends")
  }

  searchUsers(username: string): Observable<User[]> {
    return this.http.get<User[]>(
      this.url + "/search/non-friend/?username=" + username)
  }
}
