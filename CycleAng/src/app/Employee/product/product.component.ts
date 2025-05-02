import { Component } from '@angular/core';
import { InventoryService } from '../../Service/inventory.service';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-product',
  imports: [CommonModule,DatePipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  cycles:any[]=[];
  
  constructor (private inventoryService:InventoryService,
    // private modalService:NgModal
  ){}

  ngOnInit(){
      this.getInventory();
  }

  getInventory(){
    this.inventoryService.getAllProducts().subscribe(
      {
        next :(data)=>{
          this.cycles=data;
          console.log(this.cycles);
        },
        error:(err)=>
        {
            console.log(err);
        }
      }
    )
  }



  showModal = false;
  yourBaseUrl = 'https://localhost:7028';
  expandedIndex: number | null = null;
 

  getFullImageUrl(imageUrl: string): string {
    // Implement your image URL logic here
    return imageUrl ? `${this.yourBaseUrl}${imageUrl}` : 'default-image-path.jpg';
}



bicycle : any;
openModal(bicycle :any) {
  this.showModal = true;
    this.bicycle=bicycle;
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

closeModal() {
  this.showModal = false;
  document.body.style.overflow = ''; // Enable scrolling
}


}
