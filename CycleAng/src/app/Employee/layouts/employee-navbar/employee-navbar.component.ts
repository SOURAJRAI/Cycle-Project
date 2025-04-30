import { Component } from '@angular/core';
import { LoginService } from '../../../Service/loginService/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-navbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './employee-navbar.component.html',
  styleUrl: './employee-navbar.component.scss'
})
export class EmployeeNavbarComponent {
  userName = 'John Doe'; // Replace with actual user data
  userAvatar = 'https://ui-avatars.com/api/?name=John+Doe&background=3498db&color=fff';
  lowStockAlerts = 3; // Replace with actual alert count
  showProfileMenu = false;
  isSidebarCollapsed = false;

  constructor(
    private authService: LoginService
  ) {}

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
