import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';
import { ProdactsService } from 'src/app/shard/services/prodacts.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public auth: AuthService, private prodactServ: ProdactsService) { }
  public categroies: any;
  public subcategroies: any;
  public token:any;

  ngOnInit(): void {

  }


}
