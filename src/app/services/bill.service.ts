import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bill, GenerateBillDto, BulkPayDto } from '../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillService {
  private url = `${environment.apiUrl}/Bill`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Bill[]>                              { return this.http.get<Bill[]>(this.url); }
  getById(id: number): Observable<Bill>                     { return this.http.get<Bill>(`${this.url}/${id}`); }
  generate(dto: GenerateBillDto): Observable<Bill>          { return this.http.post<Bill>(`${this.url}/generate`, dto); }
  markPaid(id: number): Observable<any>                     { return this.http.patch(`${this.url}/${id}/mark-paid`, {}); }
  bulkPay(dto: BulkPayDto): Observable<any>                 { return this.http.post(`${this.url}/bulk-pay`, dto); }
  getPending(customerId: number): Observable<any>           { return this.http.get(`${this.url}/customer/${customerId}/pending`); }
  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/${id}/pdf`, { responseType: 'blob' });
  }
}