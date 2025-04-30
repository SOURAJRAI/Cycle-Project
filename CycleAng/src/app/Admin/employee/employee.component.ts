import { Component } from '@angular/core';
import { UserServiceService } from '../../Service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { start } from 'repl';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, FormsModule, AddEmployeeComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  allEmployees: any[] = [];
  employees: any[] = [];
  filteredEmployess: any[] = [];
  searchTerm: string = '';
  selectedFilter:'all' | 'active' | 'inactive' = 'active';

  constructor(private userService:UserServiceService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next:(datas) => {

      this.allEmployees = datas;
      this.employees = this.allEmployees.filter(user => user.role === 'Employee');
      this.filteredEmployess = this.employees;
      console.log("all employees",this.allEmployees);
      console.log("employee only",this.employees);
      console.log("Filtered Employess",this.filteredEmployess);
      console.log("paginated employees",this.paginatedCycles);
    },
    error:(error) => {
      console.error('Error fetching employee data:', error);
    }
  });
  }

  
  filterEmployees() {
    console.log(this.searchTerm);
    const term=this.searchTerm? this.searchTerm.toLowerCase() : '';
    console.log(term);
    this.employees = this.allEmployees.filter(employee =>
      (employee.userName?.toLowerCase().includes(term)) ||
      (employee.email?.toLowerCase().includes(term)) ||
      (employee.phoneNo?.toLowerCase().includes(term)) 
    );
  }
  



  filterByStatus(status: string) {
    if(status === 'all') {
      this.filteredEmployess = this.employees;
      this.selectedFilter = 'all';
      console.log(this.selectedFilter);
    }
    else if(status === 'active') {  
      this.filteredEmployess = this.employees.filter(employee => employee.status === '1');
      this.selectedFilter = 'active';
      console.log(this.selectedFilter);
    }
    else if(status === 'inactive') {
      this.filteredEmployess = this.employees.filter(employee => employee.status === '0');
      this.selectedFilter = 'inactive';
      console.log(this.selectedFilter);
    }
  }

  toggleStatus(employee:any){
    const updatedStatus = {...employee , status:employee.status === '1' ? '0' : '1'};
    this.userService.updateEmployee(employee.userID,updatedStatus).subscribe({
      next: (response) => {
        employee.status = updatedStatus.status; // Update the status in the local array
        console.log('Customer status updated successfully:', response,employee.status);
        // this.getCustomers(); // Refresh the customer list after updating status
      },
      error: (error) => {
        console.error('Error updating customer status:', error);
      }
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
      // this.deleteCustomer(this.customerToDeleteId);
      this.deleteEmployee(this.customerToDeleteId);

    }
    else{
      console.log('Deletion cancelled');
    }
    this.showConfirmPopup = false;
    this.customerToDeleteId = null;
  }

  deleteEmployee(employeeID:number) {
    this.userService.deleteEmployee(employeeID).subscribe({
      next: (response) => {
        console.log('Employee deleted successfully:', response);
        this.prevPage();
        this.getEmployees(); // Refresh the employee list after deletion
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });
  }

  getEmployees() {
    this.userService.getAllUsers().subscribe({
      next:(datas) => {
        this.allEmployees = datas;
        this.employees = this.allEmployees.filter(user => user.role === 'Employee');
        this.filteredEmployess = this.employees;
        console.log(this.allEmployees);
        console.log(this.employees);
      },
      error:(error) => {
        console.error('Error fetching employee data:', error);
      }
    });
  }

  isAddEmployeeOpen: boolean = false;
  selectedEmployee: any = null; 
  openAddEmployee(employee?: any) {
    if (employee) {
      this.selectedEmployee = employee; // Set the selected employee to edit
      this.isAddEmployeeOpen = true;
    }
    else {
      this.selectedEmployee = null; // Reset selected employee for adding a new one
    }
    this.isAddEmployeeOpen = true;
  }

  closeAddEmployee() {
    this.isAddEmployeeOpen = false;
  }

  getIntials(name: string) {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
  }

 
  itemsPerPage: number = 4;
  currentPage: number = 1;

  get paginatedCycles(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    console.log(startIndex+this.itemsPerPage);
    console.log(this.filteredEmployess.length);
    return this.filteredEmployess.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployess.length / this.itemsPerPage);
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
