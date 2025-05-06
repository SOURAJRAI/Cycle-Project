import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient) { }

   private apiUrl = environment.apiBaseUrl + '/Payment';
   private apiUrl1 = environment.apiBaseUrl + '/logfailedAttempts';

   save(paymentDto:any){
    return this.http.post<any>(this.apiUrl,paymentDto);
  }

  logFailedPayment(failedData:any){
    return this.http.post<any>(this.apiUrl1,failedData);
  }

}



