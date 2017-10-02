import { Configuration } from "./configuration";
import { Dashboard, DashboardType } from "./dashboard";

export interface IUser{
  firstName: string;
  lastName: string;
  department: string;
  occupation: string;
  configuration: Configuration;
}

export class User implements IUser{
  public static empty(): User{
    return new User();
  }

    firstName: string;
    lastName: string;
    department: string;
    occupation: string;
    configuration: Configuration;
  
    constructor(
      firstname?: string,
      lastname?: string,
      department?: string,
      occupation?: string,
      configuration?: Configuration
    ) {
      if(firstname){
        this.firstName = firstname;
      }
      if(lastname){
        this.lastName = lastname;
      }
      if(department){
        this.department = department;
      }
      if(occupation){
        this.occupation = occupation;
      }

      if (configuration) {
        this.configuration = configuration;
      }
      else{
        this.configuration = new Configuration()
        this.configuration.dashboards.push(new Dashboard(1, "Nyt dashboard", DashboardType.TopWidgets2Col));
      }
    }
  }