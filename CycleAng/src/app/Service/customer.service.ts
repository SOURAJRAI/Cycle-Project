import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }
  private apiUrl =environment.apiBaseUrl + '/Customer';
  private apiUrlPhone =environment.apiBaseUrl + '/Customer/by-mobile';


  getAllCustomers() {
    return this.http.get<any>(this.apiUrl);
  }

  addCustomer(customerData: any) {
    return this.http.post<any>(this.apiUrl, customerData);
  }

  updateCustomer(customerId: number, customerData: any) {
    return this.http.put<any>(`${this.apiUrl}/${customerId}`, customerData);
  }

  deleteCustomer(customerId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${customerId}`);
  }

  getCustomerByPhone(phone:any){
    return this.http.get<any>(`${this.apiUrlPhone}/${phone}`)

  }



}
