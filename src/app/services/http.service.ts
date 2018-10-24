import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // adres bazy danych
  readonly URL_DB = 'https://api.mlab.com/api/1/databases/weather_app/collections/users';
  // parametry do pobierania danych z BD
  readonly DB_params = new HttpParams().set('apiKey', '_4sLZCFmW5-QpCZDSsAk0SwGvI_GN2X8');
  // adres API pogodowego
  readonly URL_WEATHER = 'https://api.openweathermap.org/data/2.5/weather';
  // parametry do pobierania danych pogodowych
  WEATHER_params: HttpParams;

  constructor(private http: HttpClient) { }

  // pobiera userow z BD
  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(this.URL_DB, {params: this.DB_params});
  }

  // Zapisuje userow w BD
  saveUsers(list: Array<User>) {
    this.http.put<Array<User>>(this.URL_DB, list, {params: this.DB_params}).subscribe(() => {}, err => {
      console.log(err.status);
    });
  }

  // Pobiera dane pogodowe dla podanego miasta
  getWeather(city: string) {
    this.WEATHER_params = new HttpParams().
    set('APPID', 'a200a928187b2be003f91e1dc6fa0fbd').
    append('q', city).
    append('units', 'metric');
    return this.http.get(this.URL_WEATHER, {params: this.WEATHER_params});
  }

}
