import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private  http : HttpClient) { }

   apiUrl = environment.apiBaseUrl + '/Auth/login';

   Login(userName : any, password : any){
 
      return this.http.post<any>(this.apiUrl,{userName,password})
   }

   Logout(){
    localStorage.removeItem('Token')
   }

   isLoggedIn(){
    return localStorage.getItem('Token') != null;
   }

}
