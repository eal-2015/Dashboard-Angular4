import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private static minPassLength: number = 3;
  private static minUserLength: number = 3;
  private static loginBoxSelector = "#login";
  private static loginInputSelector = '#login input[type="text"]';
  private loginBox: HTMLElement;
  private userBox: HTMLElement;
  private passBox: HTMLElement;
  private boxState: string = null;
  constructor(
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.getIdentity()
      .then(x => {
        if(x){
          this.auth.setIdentity(x);
          this.ok();
          this.hide();
          //$(LoginComponent.loginBoxSelector).addClass("hide");
        }
        else{
          this.show();
          //$(LoginComponent.loginBoxSelector).removeClass("hide");
        }
      })
      .catch(x => {
        console.log(x);
      })
  }

  login(username: string, password: string): void{
    if(this.isUsername(username) && this.isPassword(password)){
      this.auth.signInAsync(username, password, this.isRemember())
      .then(x =>{
        if(x){
          this.auth.user = {
            firstName: x.firstName,
            lastName: x.lastName,
            department: x.department,
            occupation: x.occupation,
            configuration: null
          };

          this.hide();
          this.ok();
        }
        else{
          this.show();
          this.warning();
        }
      })
      .catch(x =>{
        this.show();
        this.warning();
      });
    }
    else{
      console.log("User information is not meet the requirement")
    }
    //this.auth.signIn(username, password, this.onSuccess, this.onError);
    //this.auth.fakeSignIn(username, password, this.onSuccess, this.onError);
  }

  isRemember(): boolean{
    let elm = $("#remember");
    return elm && elm.checked;
  }

  validateEmail(value: string, e: Event): void{
    if(!this.userBox){
      this.userBox = this.getElement(e);
    }
    if(!this.isEmail(value)){
      let target = this.getElement(e);
      if(target){
        $(target).addClass("error");
      }
    }
  }

  validateUsername(value: string, e: Event): void{
    if(!this.userBox){
      this.userBox = this.getElement(e);
    }
    if(!this.isUsername(value)){
      let target = this.getElement(e);
      if(target){
        $(target).addClass("error");
      }
    }
  }

  validatePassword(value: string, e: Event): void{
    if(!this.passBox){
      this.passBox = this.getElement(e);
    }
    if(this.isPassword(value)){
      
    }
    else{
      // Do something when password is invalid
    }
  }

  show(): void{
    $(LoginComponent.loginBoxSelector).removeClass("hide");
  }
  hide(): void{
    $(LoginComponent.loginBoxSelector).addClass("hide");
  }
  warning(): void{
    $(LoginComponent.loginBoxSelector).addClass("error");
  }
  ok(): void{
    $(LoginComponent.loginBoxSelector).removeClass("error");
  }
  clear(): void{
    let elm = $(LoginComponent.loginInputSelector);
    if(elm){
      elm.val("");
    }
  }

  private isReady(): boolean{
    return true;
  }

  private onAuthorize(data: any){

  }

  // This methos is not a part of this scope
  // When try to access local scope will cause an error
  private onSuccess(data: any){
    $(LoginComponent.loginBoxSelector).addClass("hide");
  }

  // This methos is not a part of this scope
  // When try to access local scope will cause an error
  private onError(data: any){
    console.log(data);
  }

  private onLogin(){
    //this.router.navigate(["./dashboard"]);
  }

  private isEmail(value: string): boolean{
    return value && value.length > 4 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  }

  private isUsername(value: string): boolean{
    return value && value.length >= LoginComponent.minUserLength && /^[A-Za-z0-9\_\-\.\@\/]+$/.test(value);
  }

  private isPassword(value: string): boolean{
    return value && value.length >= LoginComponent.minPassLength;
  }

  private getElement(e: Event): HTMLElement{
    if(e && e.target){
      return e.target as HTMLElement;
    }
    return null;
  }

}
