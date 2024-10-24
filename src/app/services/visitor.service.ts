import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Auth} from "../models/authorize.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl = 'http://localhost:8080/auths';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Auth[]> {
    return this.http.get<Auth[]>(this.apiUrl);
  }
}
