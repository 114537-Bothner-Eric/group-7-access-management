import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Auth} from "../models/authorize.model";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {SendVisitor, Visitor} from "../models/visitor.model";

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl = 'http://localhost:8080/visitors';

  constructor(private http: HttpClient) { }

  getAll(page: number, size: number, isActive?: boolean): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl);
  }
  getVisitor(visitorId: number): Observable<HttpResponse<Visitor>> {
    return this.http.get<Visitor>(`${this.apiUrl}/by-doc-number/${visitorId}`, { observe: 'response' });
  }


  upsertVisitor(visitor: SendVisitor): Observable<Visitor> {
    return this.http.put<Visitor>(this.apiUrl, visitor);
  }


}
