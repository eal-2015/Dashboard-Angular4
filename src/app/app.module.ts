//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Layout
import { AppComponent } from './app.component';
import { TopmenuComponent } from './components/topmenu/topmenu.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { FooterComponent } from './components/footer/footer.component';
import { WidgetareaComponent } from './components/widgetarea/widgetarea.component';
import { ControlsidebarComponent } from './components/controlsidebar/controlsidebar.component';

//Services
import { WidgetLibraryService } from './services/widgetLibrary-service/widget-library.service';
import { WidgetHostDirective } from './directives/widget-host.directive';
import { UserService } from './services/user-service/user.service';
import { DashboardcontrollerService } from "./services/dashboardcontroller-service/dashboardcontroller.service";

import { GoogleMapsContainerService } from "./services/googlemapscontainer/googlemapscontainer.service";
import { GooglechartsService } from "./services/googlecharts/googlecharts.service";

import { HttpModule } from '@angular/http';

//danymic components
import { LoadingModule } from 'ngx-loading';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    //Layout ----->
    TopmenuComponent,
    SidemenuComponent,
    FooterComponent,
    WidgetareaComponent,
    ControlsidebarComponent,
    WidgetHostDirective,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    LoadingModule
  ],
  providers: [WidgetLibraryService, GooglechartsService, UserService, DashboardcontrollerService, GoogleMapsContainerService, LoadingModule, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
