import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:HttpClient) { }

  apiUrl = environment.apiBaseUrl + '/Cycle';

  getAllProducts() {
    return this.http.get<any>(this.apiUrl).pipe(delay(1000));
  }

  

  
  addProduct(cycle: any) {
    return this.http.post<any>(this.apiUrl, cycle);
  }

  updateProduct(cycleID:any,cycle: any) {
    return this.http.put<any>(`${this.apiUrl}/${cycleID}`, cycle);
  }

  deleteProduct(cycleID:any) {
    return this.http.delete<any>(`${this.apiUrl}/${cycleID}`);
  }

  updateProductByStock(cycleID:number , newQauntity:number){
    return this.http.put<any>(`${this.apiUrl}/UpdateStock/${cycleID}`,{stockQuantity:newQauntity});
  }

}
