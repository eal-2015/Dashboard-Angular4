import { UserService } from './../../services/user-service/user.service';
import { Component } from '@angular/core';
import { Helper } from '../../services/helperClasses/helper';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../services/helperClasses/user';

declare var $;


@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css']
})
export class TopmenuComponent{
  displayName: string;
  firstname: string;
  lastname: string;
  department: string;
  occupation: string;

  identity: User = new User(
    "None",
    "None",
    "None",
    "None"
  );

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.identity = this.auth.user;
    window["test"] = this.identity;
  }

  public logout(){
    this.auth.signOutAsync()
      .then(x => {
        if (x === 1) {
          $("#login").removeClass("hide")
        }
      });
  }
}
