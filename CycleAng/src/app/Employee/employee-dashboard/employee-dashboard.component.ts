import { Component } from '@angular/core';
import { OrderService } from '../../Service/order.service';
import { InventoryService } from '../../Service/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  imports: [ CommonModule,RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent {
  combinedOrder: any []=[];
  recentorders: any[] = [];
  Cycles :any [] =[];


  constructor(
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private toastr:ToastrService
  ) {}

  ngOnInit() {
    this.getCombinedData();
    // this.getInventoryData();
    // this.getInventoryTime();
  }

  getCombinedData() {
    this.orderService.getCombinedData().subscribe(
      ([orders, orderDetails]) => {
        this.combinedOrder = orders.map((order: any) => {
          // const orderDetail = orderDetails.find((detail: any) => detail.orderID === order.orderID);
          const ordersDetailscount = orderDetails.filter(
            (detail: any) => detail.orderID === order.orderID
          );

          return {
            ...order,
            ordersDetails: ordersDetailscount,
            detailscount: ordersDetailscount.length,
          };
        });
        // this.recentorders = this.combinedOrder;
        this.getRecentOrders();
        console.log("order combined",this.combinedOrder);
        // console.log("Recent Orders",this.recentorders);
        
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getCycle(){

  }


  getRecentOrders() {
    // console.log("mapping inside recent orders",this.combinedOrder);
    const mappedorders = this.combinedOrder.map((order) => ({
      id: '#' + order.orderID,
      name: order.customer?.firstName + ' ' + order.customer?.lastName || 'N/A',
      product: order.ordersDetails
        ?.map((od: any) => od.cycle?.modelName)
        .join(','),
      amount: order.totalAmount,
      status: order.status,
      time: this.getTimeAgo(order.orderDate),
      actual: order.orderDate,
    }));
    console.log("mapped orders",mappedorders);
    this.recentorders = mappedorders;
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }

 
}
