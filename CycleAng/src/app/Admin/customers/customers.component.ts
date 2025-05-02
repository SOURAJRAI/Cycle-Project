import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CustomerService } from '../../Service/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { LoginService } from '../../Service/loginService/login.service';

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
  selectedFilter:'all' | 'active' | 'inactive' = 'all';
  viewMode:'grid' | 'list' ='grid';

  role=inject(LoginService);
  UserRole : string ='';
  constructor(private customerService:CustomerService) { }

  ngOnInit() {
    this.getRole();
    this.customerService.getAllCustomers().subscribe({
      next:(datas) => {
        this.allCustomers = datas;
        // this.filteredCustomers = this.allCustomers;
        this.filteredCustomers = this.UserRole == 'Employee' ? datas.filter((c :any )=> c.status == 1) : datas;
        console.log(this.filteredCustomers);
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
  
  getRole(){

    this.UserRole = this.role.getRole();
    console.log(this.UserRole);
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
        this.filterByStatus('all');
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
   

  getRandomColor(): string {
    const colors = ['#6c63ff', '#28a745', '#dc3545', '#17a2b8', '#ffc107', '#fd7e14', '#e83e8c','#D360F3'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  
  itemsPerPage: number = 4;
  currentPage: number = 1;

  get paginatedCycles(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCustomers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  
  
  get totalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  }
  
  get pages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
  }
  

}
