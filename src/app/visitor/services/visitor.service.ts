import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Visitor {
  id: number;
  name: string;
  lastname: string;
  doc_number: string;
  birth_date: Date;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl = 'http://localhost:3000/visitors'; 

  constructor(private http: HttpClient) { }

  getVisitors(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl);
  }

  getVisitor(id: number): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.apiUrl}/${id}`);
  }

  addVisitor(visitor: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(this.apiUrl, visitor);
  }

  updateVisitor(visitor: Visitor): Observable<Visitor> {
    return this.http.put<Visitor>(`${this.apiUrl}/${visitor.id}`, visitor);
  }

  deleteVisitor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
