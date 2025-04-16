import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { CustomerService } from '../../../Service/customer.service';

@Component({
  selector: 'app-add-customer',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
    @Output() close=new EventEmitter<void>();
    @Input() customerData:any = null;
    @Output() refreshCustomer=new EventEmitter<void>();

    customerForm !: FormGroup ;

    constructor(private fb:FormBuilder,private toastr:ToastrService,private customerService:CustomerService) { }
    ngOnInit() {
        this.customerForm = this.fb.group ({
            firstName:['',[Validators.required, Validators.pattern('^[A-Za-z]+$')]],
            lastName:['',[Validators.required, Validators.pattern('^[A-Za-z]+$')]],
            email:['',[Validators.required,Validators.email]],
            phoneNumber:['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
            address:['',[Validators.required]],
        });

        if(this.customerData) {
            this.customerForm.patchValue({
                firstName: this.customerData.firstName,
                lastName: this.customerData.lastName,
                email: this.customerData.email,
                phoneNumber: this.customerData.phoneNumber,
                address: this.customerData.address,
            });
        }
    }

    cancel(){
      this.close.emit();
    }

    submitForm(){
      if(this.customerForm.valid) {
         if(this.customerData) {
          this.customerService.updateCustomer(this.customerData.customerID, this.customerForm.value).subscribe({
            next: (response) => {
              console.log('customer id is',this.customerData.customerID);
              console.log('Customer updated successfully:', response);
              this.cancel();
              this.refreshCustomer.emit();
              this.toastr.success('Customer updated successfully!');
            },
            error: (error) => {
              console.log(this.customerData.customerID);
              console.error('Error updating customer:', error);
              // this.toastr.error('Error updating customer!');
            } 
          });
        }
          else{
        console.log(this.customerForm.value);
        const customerData = this.customerForm.value;
        this.customerService.addCustomer(customerData).subscribe({
          next: (response) => {
            console.log('Customer added successfully:', response);
            this.cancel();
            this.refreshCustomer.emit();
            this.toastr.success('Customer added successfully!');
            
          },
          error: (error) => {
            console.error('Error adding customer:', error);
            // this.toastr.error('Error adding customer!');
          }
        });
      }
    }
    else{
      this.toastr.error('Please fill all the required fields correctly!');
    }
  
  }
}
