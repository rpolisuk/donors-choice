import { Component, Injectable, Input, OnInit } from '@angular/core';
import { CharityService } from '../charity.service';
import { UserInfo } from '../Extra';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit {

  // user: UserInfo;
  // @Input() userActive: boolean;

  constructor(private data: CharityService) {
    // this.user = this.data.getUserStatus();
    // this.userActive = this.user.isActive;
  }

  ngOnInit(): void {
    // this.user = this.data.getUserStatus();
    // console.log(this.data.getUserStatus());
    // console.log(this.user);
    // this.userActive = this.user.isActive;

    // if(this.user.isActive == true){
    //   this.userActive = this.user.isActive;
    // }else{
    //   this.userActive = false;
    // }
  }

  myFunction() {
    const x = document.getElementById("myLinks");

    if(x){
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }
  }

}
