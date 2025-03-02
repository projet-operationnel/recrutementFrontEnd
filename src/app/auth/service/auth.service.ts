import { Injectable } from '@angular/core';
import { ParentService } from '../../shared/services/Api/parent.service';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ParentService{


  uriLogin: string = "login";
  uriLogout : string =  "logout";


  isAuthenticate(): boolean {
    return localStorage.getItem(environment.appName + "_token") != null;
  }

  getToken(): string {

    if (this.isAuthenticate()) {

      return localStorage.getItem(environment.appName + "_token")!
    }
    return "";
  }

  

  getUser(): User | null {
    return JSON.parse(localStorage.getItem(environment.appName + "_user")!) as User;
  }

  updateUserInLocalStorage(user: User): void {
      localStorage.setItem(environment.appName + "_user", JSON.stringify(user));
  }

}
