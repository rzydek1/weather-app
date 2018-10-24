import { Component } from '@angular/core';

import { User } from '../models/user';
import { UsersService } from './../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  // Lista userow
  usersList: Array<User> = [];

  // Wstrzykniecie servicow
  constructor(private userService: UsersService) {
    this.getUsers();
  }

  // pobranie userow
  getUsers() {
    this.userService.getUsersListObs().subscribe((users: Array<User>) => {
      this.usersList = users;
    }, err => {
      console.log(err.status);
    });
  }

  // Zmiana z trybu przeglądania do trybu edycji i na odwrot
  changeMode(user: User) {
    user.readMode = !user.readMode;
  }

  // Usuń usera
  deleteUser(user: User) {
    this.userService.deleteUser(user);
  }

  // zaokrąglij wartość (używane do zaokrąglenia temperatury i wilgotności w widoku)
  round(n) {
    return Math.round(n);
  }

}
