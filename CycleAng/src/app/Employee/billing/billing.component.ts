import { Component } from '@angular/core';
import { CustomerService } from '../../Service/customer.service';
import { InventoryService } from '../../Service/inventory.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../Service/order.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../Service/payment.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatIconAnchor, MatIconButton } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../Service/loginService/login.service';

interface OrderDetail {
  CycleID: number;
  Name: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}


@Component({
  selector: 'app-billing',
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule,MatSnackBarModule,MatIconModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  customerForm: FormGroup;
  orderForm: FormGroup;
  paymentForm: FormGroup;
  paymentMethods: PaymentMethod[] = [
    { id: 'upi', name: 'UPI', icon: 'fa-wallet' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'fa-credit-card' },
    { id: 'cash', name: 'Cash', icon: 'fa-money-bill-wave' }
  ];
  selectedPaymentMethod: string = '';
  currentStep: number = 1;
  customerDetails: any = null;
  cycles: any[] = [];
  orderDetails: OrderDetail[] = [];
  selectedCycle: any = null;
  isPaymentProcessing: boolean = false;
  paymentSuccess: boolean = false;
  orderTotal: number = 0;
  createdBy: string ='';// This should come from auth service in real app
  showPaymentResult: boolean = false;
  currentOrderId: number | null = null;
  printableBill: any = null;
  paymentError: string = '';
  filterCycles : any = [];


  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private inventoryService: InventoryService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService :LoginService
  ) {
    this.customerForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });

    this.orderForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      upiId: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: ['']
    });
  }

  ngOnInit(): void {
    this.loadCycles();

  
    this.getUser();
  }

  getUser(){
      this.createdBy=this.loginService.getUser().userID;
      console.log(this.createdBy);
  }


  loadCycles(): void {
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => {
        this.cycles = data;
        this.filterCycles=this.cycles.filter((cycle)=>cycle.stockQuantity >0)
        console.log(this.filterCycles);
      },
      error: (err) => {
        this.showError('Failed to load cycles');
      }
    });
  }

  findCustomer(): void {
    if (this.customerForm.invalid) return;

    const phone = this.customerForm.get('phone')?.value;
    this.customerService.getCustomerByPhone(phone).subscribe({
      next: (data) => {
        this.customerDetails = data;
        this.currentStep = 2;
        this.showSuccess('Customer details loaded successfully');
      },
      error: (err) => {
        this.showError('Customer not found. Please check the phone number or add a new customer.');
      }
    });
  }

  addToOrder(): void {
    if (!this.selectedCycle || this.orderForm.invalid) return;

    const quantity = this.orderForm.get('quantity')?.value;
    const existingItem = this.orderDetails.find(item => item.CycleID === this.selectedCycle.cycleID);

    if (existingItem) {
      existingItem.Quantity += quantity;
      existingItem.TotalPrice = existingItem.Quantity * existingItem.UnitPrice;
    } else {
      this.orderDetails.push({
        CycleID: this.selectedCycle.cycleID,
        Name: this.selectedCycle.brand + this.selectedCycle.modelName,
        Quantity: quantity,
        UnitPrice: this.selectedCycle.price,
        TotalPrice: quantity * this.selectedCycle.price
      });
    }

    this.calculateTotal();
    this.orderForm.reset({ quantity: 1 });
    this.selectedCycle = null;
    this.showSuccess('Item added to order');
  }

  removeItem(index: number): void {
    this.orderDetails.splice(index, 1);
    this.calculateTotal();
  }

  updateQuantity(item: OrderDetail, newQuantity: number): void {
    if (newQuantity < 1) return;
    item.Quantity = newQuantity;
    item.TotalPrice = item.Quantity * item.UnitPrice;
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.orderTotal = this.orderDetails.reduce((sum, item) => sum + item.TotalPrice, 0);
  }



  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.paymentForm.get('paymentMethod')?.setValue(method);
  }


  proceedToPayment(): void {
    if (this.orderDetails.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }
    this.currentStep = 3; // Payment step
  }

  processPayment(): void {
    if (this.paymentForm.invalid) {
      alert('Please complete payment details');
      return;
    }

    this.isPaymentProcessing = true;
    
    // Simulate payment processing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        this.saveOrderAndPayment();
      } else {
        this.handlePaymentFailure();
      }
    }, 2000);
  }

  saveOrderAndPayment(): void {
    this.isPaymentProcessing = true;
  
    // Format order data exactly as backend expects
    const orderData = {
      customerID: this.customerDetails.customerID, // Ensure this is a number
      status: 'Pending', // Or 'Completed' based on your flow
      createdBy: this.createdBy, // Ensure this is a number (user ID)
      orderDetails: this.orderDetails.map(item => ({
        cycleID: item.CycleID,
        quantity: item.Quantity,
        unitPrice: item.UnitPrice
        // orderID will be added by backend
      }))
    };
  
    console.log('Submitting order:', orderData);
 


    // Call service with properly formatted data
    this.orderService.addOrderDetails(orderData).subscribe({
      next: (orderResponse) => {
        console.log('Order created:', orderResponse);
        
        // Format payment data exactly as backend expects
        const paymentData = {
          orderID: orderResponse.orderID, // Use the ID from response
          amountPaid: this.orderTotal,
          paymentMethod: this.selectedPaymentMethod,
          paymentStatus: 'Success'
        };
  
        console.log('Submitting payment:', paymentData);
        
        this.paymentService.save(paymentData).subscribe({
          next: (paymentResponse) => {
            this.isPaymentProcessing = false;
            this.paymentSuccess = true;
            this.generatePrintableBill(orderResponse.orderID);
            this.currentStep = 4;
          },
          error: (paymentError) => {
            console.error('Payment error:', paymentError);
            this.isPaymentProcessing = false;
            this.paymentError = 'Payment recorded but with issues.';
            this.currentStep = 4;
          }
        });
      },
      error: (orderError) => {
        console.error('Order error:', orderError);
        console.log(orderData);
        this.isPaymentProcessing = false;
        this.paymentError = orderError.error?.message || 'Failed to create order';
        this.currentStep = 4;
      }
    });
  }
  
  handlePaymentFailure(): void {
    const paymentData = {
 
      paymentMethod: this.selectedPaymentMethod,
      customerEmail:this.customerDetails?.email,
      customerPhone : this.customerDetails?.phone || 'Not provided'
    };
  
    this.paymentService.save(paymentData).subscribe({
      next: () => {
        this.isPaymentProcessing = false;
        this.paymentSuccess = false;
        this.paymentError = 'Payment processing failed';
        this.currentStep = 4;
        console.log(paymentData);
      },
      error: (err) => {
        console.error('Failed to record payment failure:', err);
        this.isPaymentProcessing = false;
        this.paymentError = 'Failed to record payment attempt';
        this.currentStep = 4;
      }
    });
  }

  generatePrintableBill(orderId: number): void {
    this.printableBill = {
      orderId: orderId,
      customerName: this.customerDetails.firstName + '' + this.customerDetails.lastName,
      customerPhone: this.customerDetails.phoneNumber,
      date: new Date().toLocaleString(),
      items: this.orderDetails,
      subtotal: this.orderTotal,
      tax: this.calculateTax(this.orderTotal),
      total: this.orderTotal + this.calculateTax(this.orderTotal),
      paymentMethod: this.selectedPaymentMethod
    };
  }

  calculateTax(amount: number): number {
    // Example tax calculation (10%)
    return parseFloat((amount * 0.1).toFixed(2));
  }

  printBill(): void {
    
    window.print();
  }

  startNewOrder(): void {
    this.resetForms();
    this.currentStep = 1;
  }

  backToPayment(): void {
    this.currentStep = 3;
    this.paymentError = '';
  }

  resetForms(): void {
    this.customerForm.reset();
    this.orderForm.reset({ quantity: 1 });
    this.paymentForm.reset();
    this.customerDetails = null;
    this.orderDetails = [];
    this.orderTotal = 0;
    this.selectedCycle = null;
    this.selectedPaymentMethod = '';
    this.paymentSuccess = false;
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
