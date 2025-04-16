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

  cycleForm!: FormGroup;
  showForm = false;
  isEditMode = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllCycles();
 


    this.cycleForm = this.fb.group({
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
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  removeImage() {
  }

  getAllCycles() {
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

    for (const key in cycleValue) {
      cycleData.append(key, cycleValue[key]);
    }
    if(this.selectedFile) {
      cycleData.append('imageUrl', this.selectedFile, this.selectedFile.name);  

    }

    const request= this.isEditMode
    ? this.inventoryService.updateProduct(this.cycleForm.value.id, cycleData)
    : this.inventoryService.addProduct(cycleData);

    request.subscribe({
      next:(data)=>{
        console.log(data);
        this.showForm=false;
        this.cycleForm.reset();
        this.getAllCycles();
        // this.isEditMode = false;
      },
      error:(err)=>{
        console.log(err);
      },
    });

  }
    
  openEditForm(cycle: object) {
    this.isEditMode = true;
    this.showForm = true;
    this.cycleForm.patchValue(cycle);
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
    return this.cycles.map((cycle) => cycle.type);
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




  deleteCycle(cycle: any) {}

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
