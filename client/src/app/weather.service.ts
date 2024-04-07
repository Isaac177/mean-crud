import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private API_KEY = environment.weatherApiKey;
  private API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${this.API_KEY}&units=metric&q=`;

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}${city}`);
  }
}
