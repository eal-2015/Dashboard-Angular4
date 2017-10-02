import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { User } from '../helperClasses/user';
import { Helper } from '../helperClasses/helper';

interface IUserLogin{
  username: string;
  password: string;
  remember: boolean;
}

export interface IUserIdentity{
  firstName: string;
  lastName: string;
  department: string;
  occupation: string;
  displayName: string;
  token: string;
}

interface IUserSignUp{
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  department: string;
  occupation: string;
  displayName: string;
}

@Injectable()
export class AuthService {
  private static sesInfoKey: string = "authInfo";
  private static sesTokenKey: string = "authToken";
  private static identity: IUserIdentity;

  // public static urlToken = "http://localhost:63810/connect/token";
  // public static urlValidate = "http://localhost:5000/user/validate";
  // public static urlSignIn = "http://localhost:5000/login/";
  // public static urlSignOut = "http://localhost:63810/logout";
  public static urlToken = Helper.link("/connect/token");
  public static urlUserInfo = Helper.link("/connect/userinfo");
  public static urlValidate = Helper.link("/user/validate");
  public static urlSignIn = Helper.link("/login/");
  public static urlSignOut = Helper.link("/logout/");
  public static urlSignup = Helper.link("/register/");
  public static urlIdentity = Helper.link('/user/profile/');

  public user: User = User.empty();
  

  constructor(private http: Http) { }

  /**
   * Sign in User to authentication service
   * @param username Username
   * @param password Password
   * @param success Callback function on successful request(DO NOT use this as successful login)
   * @param error Callback function on error request
   */
  public signIn(username: string, password: string, success?: Function, error?: Function){
    this.authorizing({
      username: username,
      password: password,
      remember: true
    })
    .then(x => {this.successHandler(x, success)}, x => this.errorHandler(x, error));
  }

  /**
   * Sign out user from authentication service
   * @param success Callback function on successful request
   * @param error Callback function on error request
   */
  public signOut(success?: Function, error?: Function){
    this.deAuthorizing();
  }

  /**
   * Asynchronously Sign in User to authentication service
   * @param username Username
   * @param password Password
   * @param rememberMe Persistent login
   */
  public signInAsync(username: string, password: string, rememberMe?: boolean): Promise<IUserIdentity>{
    console.log("Login...");
    return this.authorizing({
      username: username,
      password: password,
      remember: rememberMe ? true : false
    });
  }

  /**
   * Asynchronously Sign out user from authentication service
   */
  public signOutAsync(): Promise<number>{
    return this.deAuthorizing();
  }

  /**
   * Asynchronously Create a user
   * @param model User Registration Requirement object
   */
  public createAsync(model: IUserSignUp): Promise<number>{
    let options = this.postHeader(model);
    return this.http.post(AuthService.urlSignup, model, options)
      .toPromise()
      .then(this.onRequest)
      .catch(this.onRequestError);
  }

  /**
   * Asynchronousely Check if user is authorized
   */
  public isAuthorized(): Promise<boolean>{
    return this.http.get(AuthService.urlValidate)
      .toPromise()
      .then(this.onRequest)
      .catch(this.onRequestError);
  }

  /**
   * Get User from local storage
   */
  public getUser(): User{
    var identity = this.getLocalIdentity();
    if(identity){
      return new User(
        identity.firstName,
        identity.lastName,
        identity.department,
        identity.occupation
      );
    }
    return null;
  }

  /**
   * Get User Identity from local/server
   */
  public getIdentity(): Promise<IUserIdentity>{
    if(sessionStorage.hasOwnProperty(AuthService.sesInfoKey)){
      return new Promise((resolve)=>{
        resolve(this.getLocalIdentity());
      });
    }
    else{
      return this.http.get(AuthService.urlIdentity)
      .toPromise()
      .then(this.onRequest)
      .catch(this.onRequestError);
    }
  }

  public isValidToken(): Promise<boolean>{
    let token = this.getToken();
    return this.http.get(AuthService.urlUserInfo, this.tokenHeader(token))
      .toPromise()
      .then(this.onRequest)
      .catch(this.onRequestError);
  }

  public getToken(): string{
    return sessionStorage.getItem(AuthService.sesTokenKey);
  }

  public setIdentity(id: IUserIdentity): void{
    if (id) {
      // Save response identity to Authentication service
      this.user.firstName = id.firstName;
      this.user.lastName = id.lastName;
      this.user.department = id.department;
      this.user.occupation = id.occupation;
      this.setLocalIdentity(id)
    }
  }

  private successHandler(data: IUserIdentity, callback?: Function){
    if(callback){
      callback(data);
    }
    if(data){
      AuthService.identity = data;
      sessionStorage.setItem(AuthService.sesInfoKey, JSON.stringify(data));
    }
  }

  private errorHandler(data: any, callback?: Function){
    if(callback){
      callback(data);
    }
  }

  private authorizing(model: IUserLogin): Promise<IUserIdentity>{
    let options = this.postHeader(model);
    return this.http.post(AuthService.urlSignIn, model, options)
      .toPromise()
      .then(x => {
        let data = x.json();
        if(data){
          let identity = data as IUserIdentity;
          this.setIdentity(identity);
        }
        return this.onRequest(x);
      })
      .catch(this.onRequestError);
  }

  private deAuthorizing(){
    return this.http.get(AuthService.urlSignOut)
      .toPromise()
      .then(x => {
        let result = x.json();
        if(result === 1){
          this.clearLocalIdentity();
        }
        return result;
      })
      .catch(this.onRequestError);
  }

  private onRequest(response: Response){
    console.log("Server response");
    let context = response.json();
    return context;
  }

  private onRequestError(error: Response | any){

  }

  private getLocalIdentity(): IUserIdentity{
    if(!AuthService.identity){
      let info = sessionStorage.getItem(AuthService.sesInfoKey);
      if(info){
        let token = sessionStorage.getItem(AuthService.sesTokenKey);
        let user = JSON.parse(info);
        user.token = token;
        AuthService.identity = user as IUserIdentity;
        if(AuthService.identity){
          return AuthService.identity;
        }
      }
      return null;
    }
    else{
      return AuthService.identity;
    }
  }

  private setLocalIdentity(data: IUserIdentity){
    if (data) {
      AuthService.identity = data;
      let id = {
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        occupation: data.occupation
      }
      let info = JSON.stringify(id);
      let token = data.token;
      sessionStorage.setItem(AuthService.sesInfoKey, info);
      sessionStorage.setItem(AuthService.sesTokenKey, token);
    }
  }

  private clearLocalIdentity(){
    this.user.firstName = "";
    this.user.lastName = "";
    this.user.department = "";
    this.user.occupation = "";
    AuthService.identity = null;
    sessionStorage.clear();
  }

  private pack(model: object): string{
    let data = null;
    for (var key in model) {
      if (model.hasOwnProperty(key)) {
        var item = model[key];
        if(data != null){
          data += "&" + key + "=" + model[key];
        }
        else{
          data = key + "=" + model[key];
        }
      }
    }
    return data;
  }

  private tokenHeader(token: string, data?: object, method?: string, origin?: string): RequestOptions{
    let head = new Headers();
    let action: RequestMethod = RequestMethod.Get;

    head.append('Authorization', 'Bearer ' + token);

    if(origin){
      head.append("Access-Control-Allow-Origin", origin);
      head.append("Access-Control-Allow-Credentials", 'true');
    }

    if(method){
      method = method.toUpperCase();
      if(method === "POST"){
        head.append('Content-Type', 'application/x-www-form-urlencoded');
      }
      else{
        head.append('Content-Type', 'application/json');
      }

      switch (method) {
        case "GET":
          action = RequestMethod.Get;
          break;
        case "POST":
          action = RequestMethod.Post;
          break;
        case "PUT":
          action = RequestMethod.Put;
          break;
        case "DELETE":
          action = RequestMethod.Delete;
          break;
        case "OPTIONS":
          action = RequestMethod.Options;
          break;
        default:
          action = RequestMethod.Get;
          break;
      }
    }

    if(data){
      return new RequestOptions({headers: head, body: data, method: action});
    }
    return new RequestOptions({headers: head, method: action});
  }

  private postHeader(model: object): RequestOptions{
    let data = new Headers({
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Credentials': 'true',
      //'Content-Type': 'application/json'
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let body = this.pack(model);
    return new RequestOptions({headers: data, body: body, method: RequestMethod.Post});
  }

}
