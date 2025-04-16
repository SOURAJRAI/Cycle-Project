import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../Service/user-service.service';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  @Output() close = new EventEmitter<void>();
  @Output() refreshEmployee = new EventEmitter<void>();
  @Input() employeeData: any = null;


  employeeForm: any;

  constructor(private fb:FormBuilder,private toastr:ToastrService,private userService:UserServiceService) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      userName: ['',[Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      email: ['',[Validators.required, Validators.email]],
      phoneNo: ['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
      passwordHash: ['',[Validators.required]],
      role: ['Employee']
    });

    if (this.employeeData) {
      this.employeeForm.patchValue({
        userName: this.employeeData.userName,
        email: this.employeeData.email,
        phoneNo: this.employeeData.phoneNo,
        passwordHash: this.employeeData.passwordHash,
        role: this.employeeData.role
      });
    }
  }
  cancel() {
    this.close.emit();
  }

  submitForm() {
    if (this.employeeForm.valid) {
      if(this.employeeData) {
        this.userService.updateEmployee(this.employeeData.userID, this.employeeForm.value).subscribe({
          next: (response) => {
            console.log('Employee updated successfully:', response);
            this.cancel();
            this.refreshEmployee.emit();
            this.toastr.success('Employee updated successfully!');
          },
          error: (error) => {
            console.log(this.employeeData.userID);
            console.log(this.employeeForm.value);
            console.error('Error updating employee:', error);
            this.toastr.error(' updating employee Failed!');
          }
        });
      }
      else {
        const employeeData = this.employeeForm.value;
        this.userService.addEmployee(employeeData).subscribe({
          next: (response) => {
            console.log('Employee added successfully:', response,this.employeeForm.value);
            
            this.cancel();
            this.refreshEmployee.emit();
            this.toastr.success('Employee added successfully!');
          },
          error: (error) => {
            console.error('Error adding employee:', error);
            console.log(this.employeeForm.value);
            this.toastr.error('Error adding employee!');
          }
        });
      }
  }
}

}
