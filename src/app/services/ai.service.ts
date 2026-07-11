import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AIService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/AI`;

  salesPrediction() {
    return this.http.get(`${this.api}/sales-prediction`);
  }

  customerInsights() {
    return this.http.get(`${this.api}/customer-insights`);
  }

  billReminder(id: number) {
    return this.http.get(`${this.api}/bill-reminder/${id}`);
  }

  voiceSale(text: string) {
    return this.http.post(`${this.api}/voice-sale`, {
      text
    });
  }
}