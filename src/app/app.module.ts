import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AddUserComponent } from './add-user/add-user.component';
import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { UserListComponent } from './user-list/user-list.component';
import { FirstUpperPipe } from './models/first-upper.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    AddUserComponent,
    FirstUpperPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
