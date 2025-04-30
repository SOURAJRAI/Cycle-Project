import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChildrenOutletContexts } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../Service/loginService/login.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private service:LoginService,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.form = this.formbuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]


    })

  }
  
  hasDislayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  login() {
    this.isSubmitted = true;
    console.log(this.form.value);
    const userName = this.form.get('userName')?.value;
    const password =this.form.get('password')?.value;


    this.service.Login(userName.trim(),password.trim()).subscribe({
      next:(response)=>{
        this.toaster.success('Login Successfull');
        console.log("response",response);
        localStorage.setItem('Token',response.token);
        const token= JSON.parse(atob(response.token.split('.')[1]))
        const  role=token.role;
        console.log(role);

        if(role =='Admin')
        {
            this.router.navigateByUrl('/admin')
        }else if(role=='Employee')
        {
          this.router.navigateByUrl('/employee')
        }else{
          this.toaster.error("Unknown Role")
        }
        
      },
      error:(err)=>{
        this.toaster.error("Login Unsuccessfull", 'Invalid login credentials')
          console.log("error while Login",err);
       
      }
    });   
}


}
