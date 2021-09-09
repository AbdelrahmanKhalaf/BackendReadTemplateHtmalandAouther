import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdactsService } from 'src/app/shard/services/prodacts.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(private router : Router ,private route : ActivatedRoute , private ProdactServic : ProdactsService) { }
   public prodacts:any
  ngOnInit(): void {

  }
  filterSale(sale:Number){
   this.router.navigate([`/filter`,{ queryParams: { 'sale': sale, } }])
  }

}

