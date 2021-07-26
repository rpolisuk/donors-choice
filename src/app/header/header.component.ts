import { Component, Injectable, Input, OnInit } from '@angular/core';
// import { loadavg } from 'os';
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
  userActive: boolean;
  usern: string;
  initials: string;

  constructor(private data: CharityService) {
    // this.user = this.data.getUserStatus();
    // this.userActive = this.user.isActive;
  }

  ngOnInit(): void {
    // this.user = this.data.getUserStatus();
    // console.log(this.data.getUserStatus());
    // console.log(this.user);
    // this.userActive = this.user.isActive;

    var jt = localStorage.getItem('access_token');

    if(jt == null || jt == ""){
      this.userActive = false;
    }else{
      this.userActive = true;

      var n = localStorage.getItem('name');

      if(n){
        this.initials = n.charAt(0).toString().toUpperCase();
        this.usern = this.initials;
      }
    }
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

  logout(){
    localStorage.setItem('access_token', "");

    this.ngOnInit();
  }

}
