import { Component } from '@angular/core';
import { CustomerService } from '../../Service/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCustomerComponent } from './add-customer/add-customer.component';

@Component({
  selector: 'app-customers',
  imports: [CommonModule,FormsModule,AddCustomerComponent],
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  

  allCustomers: any[] = [];
  filteredCustomers: any[] = [];
  searchTerm: string = '';
  inactiveCustomer: any;
  activeCustomer: any;
  customerCount:any;
  selectedFilter:'all' | 'active' | 'inactive' = 'active';

  constructor(private customerService:CustomerService) { }

  ngOnInit() {
    this.customerService.getAllCustomers().subscribe({
      next:(datas) => {
        this.allCustomers = datas;
        this.filteredCustomers = this.allCustomers;
        console.log(this.allCustomers);
        this.customerCountAll();
        this.customerCountByActive();
        this.customerCountByInactive();
      },
      error:(error) => {
        console.error('Error fetching customer data:', error);
      }
    
    });
    
  }

  customerCountAll(){
    this.customerCount= this.allCustomers.length;
  }

  customerCountByActive(){

    this.activeCustomer=this.allCustomers.filter(customer => customer.status=='1').length;
  }
  customerCountByInactive(){
    this.inactiveCustomer= this.allCustomers.filter(customer => customer.status=='0').length; 
  }

  filterCustomers() {
    console.log(this.searchTerm);
    const term=this.searchTerm? this.searchTerm.toLowerCase() : '';
    console.log(term);
    this.filteredCustomers = this.allCustomers.filter(customer =>
      (customer.firstName?.toLowerCase().includes(term)) ||
      (customer.lastName?.toLowerCase().includes(term)) ||
      (customer.email?.toLowerCase().includes(term)) ||
      (customer.phoneNumber?.toLowerCase().includes(term)) 
    );
  }
  
  filterByStatus(status: string) {
    if(status === 'all') {
      this.filteredCustomers = this.allCustomers;
      this.selectedFilter = 'all';
      console.log(this.selectedFilter);
    }
    else if(status === 'active') {  
      this.filteredCustomers = this.allCustomers.filter(customer => customer.status === '1');
      this.selectedFilter = 'active';
      console.log(this.selectedFilter);
    }
    else if(status === 'inactive') {
      this.filteredCustomers = this.allCustomers.filter(customer => customer.status === '0');
      this.selectedFilter = 'inactive';
      console.log(this.selectedFilter);
    }
  }


  isAddCustomerOpen: boolean = false;
  selectedCustomer: any = null;
  openAddCustomer(customer?: any) {
    if (customer) {
      this.selectedCustomer = customer;
      this.isAddCustomerOpen = true;
    }
    else {
      this.selectedCustomer = null;
    }
    this.isAddCustomerOpen = true;

  }
  
  closeAddCustomer(){
    this.isAddCustomerOpen = false;
  }
  getCustomers() {
    this.customerService.getAllCustomers().subscribe(customers => {
      this.allCustomers = customers;
      this.filteredCustomers = this.allCustomers; // if you are filtering
      this.customerCountAll();
      this.customerCountByActive();
      this.customerCountByInactive();
    });
  }

  showConfirmPopup: boolean = false;
  customerToDeleteId: any | null = null;

  onDeleteClick(customerId: any) {
    this.customerToDeleteId = customerId;
    console.log('Customer ID to delete:', this.customerToDeleteId);
    this.showConfirmPopup = true;
  }
  
  confirmDelete(confirm: boolean) {
    if (confirm && this.customerToDeleteId !== null) {
      console.log('Deleting customer with ID:', this.customerToDeleteId);
      this.deleteCustomer(this.customerToDeleteId);
    }
    else{
      console.log('Deletion cancelled');
    }
    this.showConfirmPopup = false;
    this.customerToDeleteId = null;
  }
  
  deleteCustomer(customerID:number) {
    this.customerService.deleteCustomer(customerID).subscribe({
      next: (response) => {
        console.log('Customer deleted successfully:', response);
        this.getCustomers(); // Refresh the customer list after deletion
        this.customerCountAll();
        this.customerCountByActive();
        this.customerCountByInactive();
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
      }
    });

  }

  toggleStatus(customer: any) {
    const updatedStatus = {...customer , status:customer.status === '1' ? '0' : '1'};
    this.customerService.updateCustomer(customer.customerID,updatedStatus).subscribe({
      next: (response) => {
        customer.status = updatedStatus.status; // Update the status in the local array
        console.log('Customer status updated successfully:', response,customer);
        this.getCustomers(); // Refresh the customer list after updating status
        this.customerCountAll();
        this.customerCountByActive();
        this.customerCountByInactive();
      },
      error: (error) => {
        console.error('Error updating customer status:', error);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    let initials = '';
    if (firstName && firstName.length > 0) {
      initials += firstName.charAt(0).toUpperCase();
    }
    if (lastName && lastName.length > 0) {
      initials += lastName.charAt(0).toUpperCase();
    }
    return initials;
  }
   

  
}
