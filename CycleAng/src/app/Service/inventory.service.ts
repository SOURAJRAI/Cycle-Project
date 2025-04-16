import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:HttpClient) { }

  apiUrl = environment.apiBaseUrl + '/Cycle';

  getAllProducts() {
    return this.http.get<any>(this.apiUrl);

  }
  addProduct(cycle: any) {
    return this.http.post<any>(this.apiUrl, cycle);
  }
  updateProduct(cycleid:any,cycle: any) {
    return this.http.put<any>(`${this.apiUrl}/${cycle.id}`, cycle);
  }


}
