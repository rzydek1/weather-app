import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpService } from '../services/http.service';
import { UsersService } from '../services/users.service';
import { country_list } from './../models/countries';
import { User } from './../models/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  // Lista Krajow
  countries;

  // podpięcie formularza
  @ViewChild('formData')
  formData: NgForm;

  // przy edycji usera pobierz go z komponentu nadrzędnego
  @Input()
  user: User;

  // Zmienna przechowująca dane z formularza
  message = new FormMessage();

  // Wiadomość ktora zostanie wyświetlona przy ewentualnym blędzie
  errorMsg = '';

  // Wstrzyknięcie serwisow
  constructor(private userService: UsersService, private http: HttpService) {
    // Inicjalizacja listy krajow
    this.countries = country_list;
   }

  // jeśli istnieje user, zainicjalizuj formularz jego danymi
  ngOnInit() {
    if (this.user) {
      this.message.name = this.user.name;
      this.message.surname = this.user.surname;
      this.message.town = this.user.town;
      this.message.country = this.user.country;
      this.message.sex = this.user.sex;
    }
  }

  onSubmit() {
    if (this.formData.valid) {
        // Sprawdxz czy dla danej lokalizacji można pobrać pogodę, jeśli nie wyświetl status bledu i ustaw errorMsg
      this.http.getWeather(this.message.town).subscribe(weather => {
        // Przypisz pogode
        this.message.weather = weather;
        // Jeśli user nie istnieje to dodaj nowego w przeciwnym razie zaktualizuj aktywnego usera
        if (!this.user) {
          this.putUser();
        } else {
          this.updateUser();
        }
      }, error => {
        console.log(error.status);
        this.errorMsg = 'Nie udało się pobrać danych pogodowych dla takiej lokalizacji!';
      });
   } else {
     this.errorMsg = 'Nie poprawnie wypełniony formularz!';
   }
  }

  // resetuje formularz
  reset() {
    this.message = new FormMessage();
    this.formData.resetForm(this.message);
  }

  // Dodanie nowego usera
  putUser() {
    // Sprawdz czy user o takim imieniu i nazwisku istnieje, jeśli nie to dodaj nowego usera z danymi z forumlarza
    if (this.userService.checkUser(this.message.name, this.message.surname) > -1) {
      this.errorMsg = 'Istnieje taki użytkownik';
    } else {
      this.userService.add({
        _id: null,
        name: this.message.name,
        surname: this.message.surname,
        town: this.message.town,
        country: this.message.country,
        sex: this.message.sex,
        readMode: true,
        weather: this.message.weather
      });
      this.errorMsg = '';
      this.reset();
    }
  }

  // zaktualizuj usera
  updateUser() {
    this.userService.updateUser({
      _id: this.user._id ? {$oid: this.user._id.$oid} : null,
      index: this.user.index,
      name: this.message.name,
      surname: this.message.surname,
      town: this.message.town,
      country: this.message.country,
      sex: this.message.sex,
      readMode: true,
      weather: this.message.weather
    });
  }
}

// klasa do pobierania danych z formularza
class FormMessage {
  constructor(
    public name?: string,
    public surname?: string,
    public town?: string,
    public country = 'Poland',
    public sex = 'Mężczyzna',
    public weather?
  ) {}
}
