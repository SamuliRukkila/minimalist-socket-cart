import { Injectable } from '@angular/core'
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Observable} from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class FineliService {
  private BASE_URL = 'https://fineli.fi/fineli/api/v1/foods'
  private QUERY = this.BASE_URL + '?q='

  constructor(private http: HttpClient) { }

  getItems(queryWord: string): Observable<any> {
    let header = new HttpHeaders()
    header.set('Access-Control-Allow-Origin', '*')
    return this.http.get<any>(this.QUERY + queryWord, { headers: new HttpHeaders({headers: "Access-Control-Allow-Origin: *"}) })
  }
}
