import { Component } from '@angular/core';

import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ChartType } from 'chart.js';
import { CommonModule, NgClass } from '@angular/common';
import { OrderService } from '../../Service/order.service';

import { TimeagoModule } from 'ngx-timeago';
import { InventoryService } from '../../Service/inventory.service';
import { subscribe } from 'diagnostics_channel';
import { error } from 'console';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-dashboard',
  imports: [NgChartsModule, NgClass, CommonModule, TimeagoModule,FormsModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
 

})
export class DashboardComponent {
  orderDetails: any[] = [];

  combinedOrder: any[] = [];

  recentorders: any[] = [];
  uniqueOrder: any[] = [];

  orders: any[] = [];
  filteredOrders: any[] = [];

  cycles: any[] = [];
  filteredCycle: any[] = [];

  constructor(
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private toastr:ToastrService
  ) {}

  ngOnInit() {
    this.getCombinedData();
    this.getInventoryData();
    this.getInventoryTime();

    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        // console.log("Ordes",this.orders);
        this.filterSales('month');
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.orderService.getAllOrderDetails().subscribe((orders: any[]) => {
      this.processOrderDistribution(orders);
    });
    this.orderService.getAllOrderDetails().subscribe({
      next: (data) => {
        this.orderDetails = data;

        const type = this.orderDetails.map((type) => type.cycle.type);
        this.uniqueOrder = Array.from(new Set(type));
      },
      error: (err) => {
        console.log(err);
      },
    });
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
        this.filteredOrders = this.combinedOrder;
        // this.recentorders = this.combinedOrder;
        this.getRecentOrders();
        // console.log("order combined",this.combinedOrder);
        // console.log("Recent Orders",this.recentorders);
        
      },
      (err) => {
        console.log(err);
      }
    );
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
    // console.log("mapped orders",mappedorders);
    this.recentorders = mappedorders;
  }

  getInventoryData() {
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => {
        this.cycles = data;
        // console.log("Cycles",this.cycles);
        this.getInventoryTime();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getInventoryTime() {
    console.log('Cycles inside get inventory', this.cycles);
    this.filteredCycle = this.cycles.map((cycle) => ({
      ...cycle,
      updatedTime: this.getTimeAgo(cycle.updatedDate),
    }));
    console.log('filtered time', this.filteredCycle);
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

  getDotClass(type: string): string {
    switch (type) {
      case 'Mountain':
        return 'mountain';
      case 'Terrain':
        return 'road';
      case 'Electric':
        return 'hybrid';
      default:
        return 'default';
    }
  }

  selectedView: 'week' | 'month' | 'year' = 'month';

  filterSales(view: 'week' | 'month' | 'year') {
    this.selectedView = view;

    const salesMap: { [key: string]: number } = {};

    this.orders.forEach((order) => {
      const cdate = order.orderDate.replace(/\.\d+Z$/, 'Z');
      const date = new Date(cdate);
      // console.log(date);

      let key = '';

      if (view === 'month') {
        key = date.toLocaleString('default', { month: 'short' });
      } else if (view === 'year') {
        key = date.getFullYear().toString();
      } else {
        const week = date.toLocaleString('en-US', { weekday: 'short' });
        // console.log("week",week);
        key = `${week}`;
      }

      salesMap[key] = (salesMap[key] || 0) + Number(order.totalAmount);
      // console.log(salesMap);
    });

    const labels = Object.keys(salesMap);
    const data = Object.values(salesMap);
    this.salesChartData = {
      labels,
      datasets: [
        {
          label: 'Total Sales',
          data,
          backgroundColor: 'rgba(123, 77, 255, 0.2)',
          borderColor: 'rgba(123, 77, 255, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(123, 77, 255, 1)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  processOrderDistribution(orders: any[]) {
    const cycleTypeCount: { [type: string]: number } = {};

    orders.forEach((detail: any) => {
      const cycleType = detail.cycle.type; // Example: "Mountain", "Road", etc.
      // console.log("cycle type",cycleType);
      cycleTypeCount[cycleType] =
        (cycleTypeCount[cycleType] || 0) + detail.quantity;
    });

    const labels = Object.keys(cycleTypeCount);
    const data = labels.map((type) => cycleTypeCount[type]);

    this.ordersChartData = {
      labels,
      datasets: [
        {
          label: 'Cycle Distribution',
          data,
          backgroundColor: [
            'rgba(101, 50, 241, 0.8)',
            'rgba(0, 170, 255, 0.8)',
            'rgba(255, 159, 28, 0.8)',
          ],
        },
      ],
    };
  }

  public salesChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(123, 77, 255, 0.2)',
        borderColor: 'rgba(123, 77, 255, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(123, 77, 255, 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  public salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2f3542',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: (value) => '₹' + value.toLocaleString(),
        },
      },
      x: { grid: { display: false } },
    },
  };

  public salesChartType: ChartType = 'line';

  public ordersChartType: 'doughnut' = 'doughnut';
  // Orders Chart Data
  public ordersChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(101, 50, 241, 0.8)',
          'rgba(0, 170, 255, 0.8)',
          'rgba(255, 159, 28, 0.8)',
        ],
        borderColor: [
          'rgba(123, 77, 255, 1)',
          'rgba(0, 168, 255, 1)',
          'rgb(255, 165, 39)',
        ],
        borderWidth: 1,
      },
    ],
  };

  public ordersChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2f3542',
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    cutout: '75%',
  };



  getStockStatus(stock: number, total: number = 30): string {
    if (stock === 0) return 'out-of-stock';

    const percent = (stock / total) * 100;

    if (percent <= 10) return 'critical';
    if (percent <= 30) return 'warning';
    if (percent <= 70) return 'good';
    return 'excellent';
  }

  getStockAlertText(item: any): string {
    const status = this.getStockStatus(item.stockQuantity, 30);
    switch (status) {
      case 'critical':
        return 'Low stock';
      case 'warning':
        return 'Reorder soon';
      case 'good':
        return 'In stock';
      case 'excellent':
        return 'Well stocked';
      case 'out-of-stock':
        return 'Out of stock';
      default:
        return '';
    }
  }

  getStatusText(item: any): string {
    const status = this.getStockStatus(item.stockQuantity, 30);
    switch (status) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'good':
        return 'Good';
      case 'excellent':
        return 'Excellent';
      case 'out-of-stock':
        return 'Empty';
      default:
        return '';
    }
  }

  getLowStockCount(): number {
    return this.filteredCycle.filter((item) => item.stockQuantity<5).length;
  }

  getOutOfStockCount(): number {
    return this.filteredCycle.filter(
      (item) => this.getStockStatus(item.stockQuantity, 30) === 'out-of-stock'
    ).length;
  }

// In your component.ts
isOrderModalOpen=false;
lowStockCycles:any[]=[];
restockMap : {[cycleID:number]:number} ={};
restockCardStates:{[cycleID:number]:'idle' | 'updating' | 'updated'}={};
selectedCycle:any;

openModal(){
  this.lowStockCycles=this.cycles.filter(cycle=> cycle.stockQuantity <10);
  this.isOrderModalOpen=true;
  for(const cycle of this.lowStockCycles){
    this.restockMap[cycle.cycleID]=cycle.stockQuantity;
  }
  console.log("SelectedCycle",this.lowStockCycles);
}


adjustQuantity(cycleID:number,amount:number):void {
  const current =this.restockMap[cycleID] || 0;
  const updated= current + amount;

  if(updated >=0 && updated <=30)
  {
    this.restockMap[cycleID]=updated;
  }
}
getTotalOrderQuantity():number{
  return Object.values(this.restockMap).reduce((total,qty)=> total +(qty || 0),0);
}



confirmRestock():void{
    for(const  cycle of this.lowStockCycles)
    {
      const newQauntity = this. restockMap[cycle.cycleID];
      if(newQauntity !== cycle.stockQuantity)
      {
        this.restockCardStates[cycle.cycleID]='updating';
        this.inventoryService.updateProductByStock(cycle.cycleID,newQauntity)
        .subscribe({
          next:()=>{
            cycle.stockQuantity = newQauntity
            this.restockCardStates[cycle.cycleID] ='updated';
            this.isOrderModalOpen=false;
            this.toastr.success("Re-Stock Successfull");
            console.log(newQauntity);
            console.log("after Update",cycle);

          },
          error:(err)=> 
          {
            console.log(err);
            console.log("cycle",cycle);
            this.restockCardStates[cycle.cycleID]='idle';
          }
        });
      }
    }
}

  getTotalOrders(){
    return this.orders.length;
  }

  getTotalRevenue (){
    return this.orders.reduce((total,cycle)=> total + cycle.totalAmount,0)
  }
  getTotalPending(){
    return this.orders.filter(order=>order.status=='Pending').length;
  }

  getTotalCustomers(){
    return this.orders.map(order=> order.customer).length;
  }

}
