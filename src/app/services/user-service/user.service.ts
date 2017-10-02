import { Injectable } from '@angular/core';
import { User } from "../helperClasses/user";
import { Configuration } from "../helperClasses/configuration";
import { Dashboard, DashboardType } from "../helperClasses/dashboard";
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  private user: User;

  constructor(private auth: AuthService) {
    
  }

  public getUserData(): User{
    // //if authenticated
    // //Get user from server
    // //Store in user variable

    // //Test - Last parameter is null, so a configuration will be generated
    // if(this.user == undefined){
    //   let d = new Dashboard(1, "Standard1Col", 1, [2]);
    //   let d2 = new Dashboard(2, "Content2col", 4, [2]);
    //   let das = [];
    //   das.push(d);
    //   das.push(d2);
    //   let config = new Configuration(das);
    //   this.user = new User("Mikkel", "Andersen", "IT & Digitalisering", "Praktikant", config); 
    // }
    // return this.user;

    var u = this.auth.getUser();
    if(u && !u.configuration){
      let d = new Dashboard(1, "Standard1Col", 1, [2]);
      let d2 = new Dashboard(2, "Content2col", 4, [2]);
      let das = [];
      das.push(d);
      das.push(d2);
      let config = new Configuration(das);
      u.configuration = config;
    }

    return u;
  }

  public removeDashboard(dashboardId: number) {
    //Call api to remove

    //Remove from local data
    let dashboard;
    for (var index = 0; index < this.user.configuration.dashboards.length; index++) {
      if (this.user.configuration.dashboards[index].id == dashboardId) {
        this.user.configuration.dashboards.splice(index, 1);
        break;
      }
    }
  }

  public saveDashboard(dashboard: Dashboard) {
    //Call api to add

    //Add to local data
    //Temp solution. should fetch new form usre to get updated.
    dashboard.id = this.user.configuration.dashboards.length + 1001;
    let dash = new Dashboard(this.user.configuration.dashboards.length + 1001, dashboard.name, dashboard.type); 
    this.user.configuration.dashboards.push(dash);
  }

  public addWidget(widgetId: number, dashboardId: number) {
    //Call api to add

    //Add to local data
    this.user.configuration.dashboards.find(d => d.id == dashboardId).widgets.push(widgetId);
  }

  public removeWidget(widgetId: number, dashboardId: number) {
    //Call api to remove

    //Add to local data
    let d = this.user.configuration.dashboards.find(d => d.id == dashboardId);
    if(d != undefined){
      for (var index = 0; index < d.widgets.length; index++) {
        if(d.widgets[index] == widgetId){
          d.widgets.splice(index, 1);
        }     
      }
    }
  }
}
