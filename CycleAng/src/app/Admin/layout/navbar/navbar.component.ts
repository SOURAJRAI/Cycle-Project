import { Component } from '@angular/core';
import { LoginService } from '../../../Service/loginService/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor (private LoginService :LoginService,
    private router:Router
  ) {}


  Logout(){
    this.LoginService.Logout();
    this.router.navigateByUrl('/login')
  }
}
