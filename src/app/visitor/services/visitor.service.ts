import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SendVisitor, Visitor } from '../models/visitor.model';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiUrl = 'http://localhost:8080/visitor';

  constructor(private http: HttpClient) {}

  getVisitors(page: number = 0, size: number = 10): Observable<Visitor[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Visitor[]>(this.apiUrl + '/getAll', { params });
  }

  getVisitor(id: number): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.apiUrl}/${id}`);
  }

  upsertVisitor(visitor: SendVisitor): Observable<Visitor> {
    return this.http.post<Visitor>(this.apiUrl + '/upsert', visitor);
  }

  deleteVisitor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
