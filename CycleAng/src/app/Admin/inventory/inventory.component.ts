import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InventoryService } from '../../Service/inventory.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { parse } from 'path';
import { ToastrService } from 'ngx-toastr';
import e from 'express';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  viewMode: 'card' | 'table' = 'card';
  cycles: any[] = [];
  filteredCycles: any[] = [];

  searchQuery = '';
  selectedType = 'all';
  isLoading = false;

  particles = Array(20).fill(0);
  cycleForm!: FormGroup;
  showForm = false;
  isEditMode = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private  toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllCycles();
 


    this.cycleForm = this.fb.group({
      cycleID: [0],
      brand: ['', [Validators.required]],
      modelName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      stockQuantity: ['', [Validators.required, Validators.min(1)]],
      imageUrl: ['', []],
      warrantyPeriod: ['', []],
      description: ['', []],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.cycleForm.patchValue({ imageUrl: '' });
  }

  getAllCycles() {
    this.isLoading = true;
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => {
        this.cycles = data;
        this.filteredCycles = data;
        console.log(this.cycles);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveCycle() {
    if(this.cycleForm.invalid) {
      this.cycleForm.markAllAsTouched();
      return;
    }
    const cycleData = new FormData();
    const cycleValue=this.cycleForm.value;
    console.log(this.selectedFile);
  

    for (const key in cycleValue) {
      cycleData.append(key, cycleValue[key]);
    }
    if(this.selectedFile) {
      cycleData.append('imageUrl', this.selectedFile, this.selectedFile.name);  
    } else if(this.isEditMode && this.existingImageUrl) {
      cycleData.append('imageUrl', this.existingImageUrl);
    }

    const request= this.isEditMode
    ? this.inventoryService.updateProduct(this.cycleForm.value.cycleID, cycleData)
    : this.inventoryService.addProduct(cycleData);
    
    request.subscribe({
      next:(data)=>{
        console.log(data);
        this.showForm=false;
        this.cycleForm.reset(
          {cycleID: 0},
        );
        this.getAllCycles();
        this.toastr.success(this.isEditMode ? 'Cycle updated successfully!' : 'Cycle added successfully!');
        this.selectedFile = null;
        this.imagePreview = null;
        
        // this.isEditMode = false;
      },
      error:(err)=>{
        console.log(this.cycleForm.value);
        console.log(err);
        this.toastr.error('Error occurred while saving the cycle!');
      },
    });
    
  }
  showConfirmPopup: boolean = false;
  cycleToDeleteId: any | null = null;

  onDeleteClick(cycleId: any) {
    this.cycleToDeleteId = cycleId;
    console.log('Cycle ID to delete:', this.cycleToDeleteId);
    this.showConfirmPopup = true;
  }

  confirmDelete(confirm: boolean) {
    if (confirm && this.cycleToDeleteId !== null) {
      console.log('Deleting cycle with ID:', this.cycleToDeleteId);
      this.deleteCycle(this.cycleToDeleteId);
      this.toastr.success('Cycle deleted successfully!');
    } else {
      console.log('Deletion cancelled');
      this.toastr.info('Cycle deletion cancelled!');
    }
    this.showConfirmPopup = false;
    this.cycleToDeleteId = null;
  }


  deleteCycle(cycleID: any) {
    this.inventoryService.deleteProduct(cycleID).subscribe({
      next: (data) => {
        
        console.log(data);
        this.getAllCycles();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  

  existingImageUrl: string = '';
  openEditForm(cycle: any) {
    this.isEditMode = true;
    this.showForm = true;
    this.cycleForm.patchValue(cycle);
    this.imagePreview = `https://localhost:7028/${cycle.imageUrl}`  ;
    this.existingImageUrl = cycle.imageUrl;
    // this.imagePreview = cycle.imageUrl;
    console.log(this.imagePreview);
    console.log(cycle);
  }
 
  openAddForm() {
    this.isEditMode = false;
    this.showForm = true;
    this.cycleForm.reset();
  }

  applyFilters() {
    this.filteredCycles = this.cycles.filter((cycle) => {
      const matchesSearchQuery =
        cycle.modelName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        cycle.brand.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType =
        this.selectedType === 'all' || cycle.type === this.selectedType;
      return matchesSearchQuery && matchesType;
    });
  }

  getUniqueTypes() {
    const types=this.cycles.map((cycle) => cycle.type);
    return Array.from(new Set(types));
  }
 
  getStockClass(stock: number): any {
    if (stock > 10) return 'in-stock';
    if (stock > 0) return 'low-stock';
    return 'out-of-stock';
  }

  getStockStatus(stock: number): any {
    if (stock > 10) return 'in-stock';
    if (stock > 0) return 'low-stock';
    return 'out-of-stock';
  }





  getAvailableCount(): any {
    return this.cycles.filter((cycle) => cycle.stockQuantity > 10).length;
  }
  getLowStockCount(): any {
    return this.cycles.filter(
      (cycle) => cycle.stockQuantity <= 10 && cycle.stockQuantity > 0
    ).length;
  }
  getOutOfStockCount(): any {
    return this.cycles.filter((cycle) => cycle.stockQuantity === 0).length;
  }
  getTotalInventoryValue(): any {
    return this.cycles.reduce(
      (total, cycle) => total + cycle.price * cycle.stockQuantity,
      0
    );
  }

  itemsPerPage: number = 4;
  currentPage: number = 1;

  get paginatedCycles(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCycles.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCycles.length / this.itemsPerPage);
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
}
