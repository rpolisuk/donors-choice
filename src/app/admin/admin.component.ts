import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin, Result } from '../Admin';
import { Cancel, Status } from '../CancelDonation';
import { CharityService } from '../charity.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  charitiesArray: Array<Result>; 

  public admin: Admin;
  public result: Result;

  querySub2: any;
  cancel: Cancel;
  donationStatusConfirmed: Status;
  donationStatusFailed: Status;

  constructor(private data: CharityService, private router: Router) { }

  ngOnInit(): void {

    this.admin = {
      email: ""
    }

    this.cancel = {
      cancelID: ""
    }

    this.donationStatusConfirmed = {
      status: "confirmed"
    }

    this.donationStatusFailed = {
      status: "failed"
    }

  }


  formSubmit(f: NgForm){

    const eError = document.getElementById("eError");
    const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;
    const successError = document.getElementById("successError");

    if(f.invalid){
      console.log("Error in form submission");
      return;
    }
    else if(eError && !eRegex.test(this.admin.email)){
      eError.innerHTML = "Only Gmail address is allowed";
    }
    else{

      this.data.getAllDonationsByDonorId(this.admin.email).subscribe(myData => {
        if (myData) {
          this.charitiesArray = myData.results;
        }
      }, err => {
        if(err.status == 500){
          console.log("500 Error");

          if(successError)
            successError.innerHTML = "Please enter valid Donation ID"
        }
        if(err.status == 401){
          console.log("401 Error");

          if(successError)
            successError.innerHTML = "User is not authorized to perform this action"
        }
        if(err.status == 400){
          console.log("400 Error");

          if(successError)
            successError.innerHTML = "Error in submission. Please try again later"
        }
        if(err.status == 422){
          console.log("422 Error");

          if(successError)
            successError.innerHTML = "Please enter valid Donor Email Address"
        }
      });

      //f.resetForm();

      if(eError)
        eError.innerHTML = "";
    }
  }


  confirmDonation(pickupID){
    this.querySub2 = this.data.cancelDonationById(pickupID, this.donationStatusConfirmed).subscribe(myData => {
      if(myData){
        window.alert(`The donation with pickup ID: ${pickupID} is Confirmed. An email has been sent to the user with donation details.`);
      }
    });
  }

  failedDonation(pickupID){
    this.querySub2 = this.data.cancelDonationById(pickupID, this.donationStatusFailed).subscribe(myData => {
      if(myData){
        window.alert(`The donation with pickup ID: ${pickupID} is Failed. An email has been sent to the user with donation details.`);
      }
    });
  }

}
