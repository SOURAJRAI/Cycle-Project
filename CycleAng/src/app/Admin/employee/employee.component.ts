import { Component } from '@angular/core';
import { UserServiceService } from '../../Service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from "./add-employee/add-employee.component";

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
      console.log(this.allEmployees);
      console.log(this.employees);
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




}
