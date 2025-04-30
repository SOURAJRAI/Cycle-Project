import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

    private apiUrl = environment.apiBaseUrl + '/Order';
    private apiUrl2 = environment.apiBaseUrl + '/Orderdetails';

  getAllOrders() {
    return this.http.get<any>(this.apiUrl);
  }

  getAllOrderDetails() {
    return this.http.get<any>(this.apiUrl2);
  }

  getCombinedData(){
    return forkJoin([
      this.http.get<any>(this.apiUrl),
      this.http.get<any>(this.apiUrl2)
    ]);
  }


  updateOrder(orderID:number,status:string)
  {
    // const statuscap=status[0].toUpperCase()+status.slice(1);
    return this.http.put<any>(`${this.apiUrl}/${orderID}`,{status:status})
  }



}
