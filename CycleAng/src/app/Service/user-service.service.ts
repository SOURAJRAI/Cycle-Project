import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http:HttpClient) { }



  private apiUrl =environment.apiBaseUrl + '/user'; 

  getAllUsers() {
  return this.http.get<any>(this.apiUrl);
  }
  addEmployee(userData: any) {
    return this.http.post<any>(this.apiUrl, userData);
  }
  updateEmployee(userId: number, userData: any) {
    console.log(userData);
    return this.http.put<any>(`${this.apiUrl}/${userId}`, userData);
  }
  
  deleteEmployee(userId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }


}
