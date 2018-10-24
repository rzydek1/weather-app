import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Lista userow
  users = new BehaviorSubject<Array<User>>([]);

  // wstrzykniecie servicu http
  constructor(private http: HttpService) {

    this.http.getUsers().subscribe(user => {
      // przypisz i posortuj pobranych userow
      this.users.next(this.sortUsers(user));
      // Pobierz pogodę dla userow
      this.getWeather();
    }, error => {
      console.log(error.status);
    });
  }

  // Pobranie pogody z servicu
  getWeather() {
    this.users.getValue().map(el => {
      this.http.getWeather(el.town).subscribe(weather => {
        // przypisz dla każdego usera pogode dla jego miasta
        el.weather = weather;
      }, err => {
        console.log(err.status);
      });
    });
  }

  // zwraca liste userow jako observable
  getUsersListObs(): Observable<Array<User>> {
    return this.users.asObservable();
  }

  // dodanie usera
  add(user: User) {
    // przypisz nowemu userowi index
    user.index = this.users.getValue().length;
    // przypisz do lokalnej listy userow
    const list = this.users.getValue();
    // dodaj do niej nowego usera
    list.push(user);
    // zaktualizuj globalną list userow
    this.users.next(list);
    // zapisz list userow w BD
    this.http.saveUsers(list);
  }

  // update usera
  updateUser(user: User) {
    // przypisz do lokalnej listy userow
    const list = this.users.getValue();
    // zaktualizuj dane usera o tym samym id
    list[user.index] = user;
    // zaktualizuj globalną list userow
    this.users.next(list);
    // zapisz list userow w BD
    this.http.saveUsers(list);
  }

  // Usunięcie usera
  deleteUser(user: User) {
    // przypisz do lokalnej listy userow
    let list = this.users.getValue();
    // Usuń z listy lokalnej usera
    list = list.filter(el => {
      return el !== user;
    });
    // Przypisz nowe indexy
    for (let i = 0; i < list.length; i++) {
      list[i].index = i;
    }
    // zaktualizuj globalną list userow
    this.users.next(list);
    // zapisz list userow w BD
    this.http.saveUsers(list);
  }

  // Sprawdx czy user o podanym imieniu i nazwisku istnieje
  checkUser(name: string, surname: string) {
    return this.users.getValue().findIndex(el => {
      return (el.name === name && el.surname === surname);
    });
  }

  // Sortowanie wg indexu
  sortUsers(list: Array<User>) {
    return list.sort((a, b) => {
      if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}
