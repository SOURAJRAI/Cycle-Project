import { Routes } from '@angular/router';
import path from 'path';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { EmployeeComponent } from './Admin/employee/employee.component';
import { InventoryComponent } from './Admin/inventory/inventory.component';
import { CustomersComponent } from './Admin/customers/customers.component';
import { OrdersComponent } from './Admin/orders/orders.component';



export const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path:'dashboard', component:DashboardComponent},
    {path:'employee', component:EmployeeComponent},
    {path:'inventory', component:InventoryComponent},
    {path:'customers', component:CustomersComponent},
    {path:'orders', component:OrdersComponent}
    
];
