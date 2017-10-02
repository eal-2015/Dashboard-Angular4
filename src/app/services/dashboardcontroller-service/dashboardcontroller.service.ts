import { Injectable } from '@angular/core';
import { UserService } from "../user-service/user.service";
import { Dashboard, DashboardType } from "../helperClasses/dashboard";

@Injectable()
export class DashboardcontrollerService {

  //Events for sidemenu component to call
  //Subscriber is widgetarea which will handle the event
  public addWidgetEvent: { (widgetId: number): void; };
  public removeWidgetEvent: { (widgetId: number): void; };
  public changeDashboardEvent: { (): void; };

  //Private fiels to keep track of data
  private dashboards: Dashboard[];
  private activeDashboard: Dashboard; //Widgetarea and sidemenu will coordinate from this variable

  constructor(private userService: UserService) {
    this.dashboards = [];
    this.getDashboardConfiguration();  //Setup from userservice
  }

  //loads in the dashboard configuration from user service
  private getDashboardConfiguration() {
    //this.dashboards = this.userService.getUserData().configuration.dashboards;
    //If there is no dashboards - the active will be undefined
    if (this.activeDashboard == undefined) {
      //start with the 1st one as active dashboard if there is any
      if (this.dashboards.length != 0) {
        this.activeDashboard = this.dashboards[0];
      }
    }
  }

  //Fire event to widgetarea when sidemenu calls function
  public changeDashboard(dashboardId: number) {
    //Get the data from userservice
    this.getDashboardConfiguration();
    //and set up the active dashboard and fire event to widgetarea
    this.activeDashboard = this.dashboards.find(d => d.id == dashboardId);
    this.changeDashboardEvent();
  }

  //Fire event to widgetarea when sidemenu calls function
  public addWidget(widgetId: number) {
    //If no active dashboard then nothing should happen
    if (!this.activeDashboard) {
      return;
    }
    //Ask userservice to add widget and fire event to widgetarea
    this.userService.addWidget(widgetId, this.activeDashboard.id);
    this.addWidgetEvent(widgetId);
  }

  //Fire event to widgetarea when sidemenu calls function
  public removeWidget(widgetId: number) {
    //If no active dashboard - nothing should happen
    if (!this.activeDashboard) {
      return;
    }
    //ask userservice to remove widget and fire event to widgetarea
    this.userService.removeWidget(widgetId, this.activeDashboard.id);
    this.removeWidgetEvent(widgetId);
  }

  //Removes dashboard when sidemenu calls function
  public removeDashboard(dashboardId: number) {
    //Ask userservice to remove dashboard
    this.userService.removeDashboard(dashboardId);

    //if the dashboard being removed is the current one
    //then set the active dashboard to nothing and fire event to widgetare
    //sidemenu will handle the changing to other dashboard if more are available
    if (dashboardId == this.activeDashboard.id) {
      this.activeDashboard = undefined;
      this.changeDashboardEvent();
    }
  }

  public addDashboard(title: string, type: number) {
    let dashboard = new Dashboard(-1, title, type);

    //Ask userservice to create new dashboard
    this.userService.saveDashboard(dashboard);

    //if there is no active dashboard, set this new one to be the active one.
    if (this.activeDashboard == undefined) {
      this.activeDashboard = this.dashboards[0];
      //Tell widgetarea to change to the active one.
      this.changeDashboardEvent();
    }
  }

  //Used by sidemenu to populate dashboard list
  public getDashboards(): Dashboard[] {
    return this.dashboards;
  }

  //Used by widgetarea and sidemenu to get the active dashboard and populate active widgets
  public getActiveDashboard(): Dashboard {
    //bug fix - Widgets became duplicated for ubknown reasons, this removes duplicated widgets
    if (this.activeDashboard) {
      this.activeDashboard.widgets =
        this.activeDashboard.widgets.filter(function (elem, index, self) {
          return index == self.indexOf(elem);
        })
    }
    return this.activeDashboard;
  }
}