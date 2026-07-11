import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer, CreateCustomerDto, Product } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private url = `${environment.apiUrl}/Customer`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]>                             { return this.http.get<Customer[]>(this.url); }
  getById(id: number): Observable<Customer>                    { return this.http.get<Customer>(`${this.url}/${id}`); }
  search(q: string): Observable<Customer[]>                    { return this.http.get<Customer[]>(`${this.url}/search?q=${q}`); }
  create(dto: CreateCustomerDto): Observable<Customer>         { return this.http.post<Customer>(this.url, dto); }
  update(id: number, dto: CreateCustomerDto): Observable<Customer> { return this.http.put<Customer>(`${this.url}/${id}`, dto); }
  delete(id: number): Observable<void>                         { return this.http.delete<void>(`${this.url}/${id}`); }
  toggle(id: number): Observable<void>                         { return this.http.patch<void>(`${this.url}/${id}/toggle`, {}); }
}