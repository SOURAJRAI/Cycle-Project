import { Routes } from '@angular/router';
import path from 'path';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { EmployeeComponent } from './Admin/employee/employee.component';
import { InventoryComponent } from './Admin/inventory/inventory.component';
import { CustomersComponent } from './Admin/customers/customers.component';
import { OrdersComponent } from './Admin/orders/orders.component';
import { LoginComponent } from './Auth/login/login.component';
import { AdminlayoutComponent } from './Admin/adminlayout/adminlayout.component';
import { EmployeeLayoutComponent } from './Employee/employee-layout/employee-layout.component';
import { guardGuard } from './Guard/guard.guard';
import { EmployeeDashboardComponent } from './Employee/employee-dashboard/employee-dashboard.component';
import { ProductComponent } from './Employee/product/product.component';



export const routes: Routes = [
    {path: '', redirectTo:'login',pathMatch:'full' },
    {path: 'login', component: LoginComponent },
    {path : 'admin', component:AdminlayoutComponent,canActivate:[guardGuard],
        children :[
            {path:'',redirectTo:'dashboard',pathMatch:'full'},
            {path:'dashboard', component:DashboardComponent},
            {path:'employee', component:EmployeeComponent},
            {path:'inventory', component:InventoryComponent},
            {path:'customers', component:CustomersComponent},
            {path:'orders', component:OrdersComponent}
        ]
    },
    {path : 'employee', component:EmployeeLayoutComponent,canActivate:[guardGuard],
        children :[
            {path:'',redirectTo:'dashboard',pathMatch:'full'},
            {path:'employeedashboard', component:EmployeeDashboardComponent},
            {path:'employeeemployee', component:EmployeeComponent},
            {path:'employeeproducts', component:ProductComponent},
            {path:'employeecustomers', component:CustomersComponent},
            {path:'employeeorders', component:OrdersComponent}
        ]
    }
    
];
