import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://127.0.0.1:8000/predict';

  constructor(private http: HttpClient) {}

  getPrediction(data: { feature1: number; feature2: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
