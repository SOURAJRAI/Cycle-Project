import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrderService } from '../../Service/order.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../Service/loginService/login.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,DatePipe,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
    showModal= false;
    role=inject(LoginService);
    constructor(private orderService:OrderService,
      private toastrService:ToastrService
    ) { }
    orders: any[] = [];
    orderDetails: any[] = [];
    combinedData: any[] = [];
    filteredOrders: any[] = [];
    UserRole :string ='';

    ngOnInit() {
        this.getAllOrders();
        this.getAllOrderDetails();
        this.getCombinedData();
        this.getRole();
        console.log(this.UserRole);
    }

    getRole(){

      this.UserRole = this.role.getRole();

    }
  

    getAllOrders() {
        this.orderService.getAllOrders().subscribe((data: any) => {
            this.orders = data;
            console.log("Order Contents",this.orders);
        });
    }
    getAllOrderDetails() {
        this.orderService.getAllOrderDetails().subscribe((data: any) => {
            this.orderDetails = data;
            console.log("order Details Content",this.orderDetails);
        });
    }
    getCombinedData() {
      this.orderService.getCombinedData().subscribe(
        ([orders, orderDetails]) => {
          this.combinedData= orders.map((order: any) => {
            // const orderDetail = orderDetails.find((detail: any) => detail.orderID === order.orderID);
            const ordersDetailscount = orderDetails.filter((detail: any) => detail.orderID === order.orderID);
            return {
              ...order,
              ordersDetails:ordersDetailscount,
              detailscount: ordersDetailscount.length,
            };
          }
          );
          this.filteredOrders = this.combinedData;
          console.log("order combined",this.combinedData);
        },
        (error) => {
          console.error('Error fetching combined data:', error);
        }
      );
    }

    searchItem: any = '';
    searchOrders() {
      console.log("searchItem",this.searchItem);
        if (this.searchItem) {
            this.filteredOrders = this.combinedData.filter((order) => {
              console.log("order",order);
                return (
                    order.customer.firstName.toLowerCase().includes(this.searchItem.toLowerCase()) ||
                    order.customer.lastName.toLowerCase().includes(this.searchItem.toLowerCase()) ||
                    order.customer.email.toLowerCase().includes(this.searchItem.toLowerCase()) ||
                    order.status.toLowerCase().includes(this.searchItem.toLowerCase())
                );
            });
        } else {
            this.filteredOrders = this.combinedData;
        }
    }

    getTotalOrdersCount(): number {
        return this.combinedData.length;
    }
    getTotalRevenue(): number {
      return this.combinedData.reduce((total, order) => total + order.totalAmount, 0);
    }
    getPendingOrdersCount(): number {
        return this.combinedData.filter((order) => order.status === 'Pending').length;
    }
    getShippedOrdersCount(): number {
        return this.combinedData.filter((order) => order.status === 'Shipped').length;
    }
    getDeliveredOrdersCount(): number {
        return this.combinedData.filter((order) => order.status === 'Delivered').length;
    }
    getCancelledOrdersCount(): number {
        return this.combinedData.filter((order) => order.status === 'Cancelled').length;
    }




    selectedOrder: any = null;
    toggleModal(order: any) {
        this.showModal = !this.showModal;
        this.selectedOrder = order;
        console.log("order",this.selectedOrder);
      
    }

    selectedStatus: any = 'all'; 
    filterOrdersByStatus(status: string) {
        this.selectedStatus = status;
        if (status === 'all') {
            this.filteredOrders = this.combinedData;
        } else {
            this.filteredOrders = this.combinedData.filter((order) => order.status === status);
        }
        this.currentPage = 1; // Reset to the first page after filtering
    }

    



  itemsPerPage: number = 4;
  currentPage: number = 1;

  get paginatedCycles(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getInitials(firstName: string, lastName: string): string {
    let initials = '';
    if (firstName && firstName.length > 0) {
      initials += firstName.charAt(0).toUpperCase();
    }
    if (lastName && lastName.length > 0) {
      initials += lastName.charAt(0).toUpperCase();
    }
    return initials;
  }

  selectedSort :string ='';
  sortOrders() {
    if (this.selectedSort === 'pricelow') {
      this.filteredOrders.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (this.selectedSort === 'pricehigh') {
      this.filteredOrders.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (this.selectedSort === 'oldest') {
      this.filteredOrders.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
    } else if (this.selectedSort === 'newest') {
      this.filteredOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }
  }


  updateOrderStatus(orderID:number,status:string)
  {
    this.orderService.updateOrder(orderID,status).subscribe(
      {
        next:()=> {
          this.toastrService.success("Status Updated Succesfully")
        console.log(status);
        },
        error:()=>{
          this.toastrService.error("Status change unsuccessfull")
        console.log(status);
        }
      })

  }


}
