import { Component } from '@angular/core';
import { EmployeeNavbarComponent } from "../layouts/employee-navbar/employee-navbar.component";

import { RouterOutlet } from '@angular/router';





@Component({
  selector: 'app-employee-layout',
  imports: [EmployeeNavbarComponent,RouterOutlet],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.scss'
})
export class EmployeeLayoutComponent {

}
