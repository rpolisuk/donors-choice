import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Reconciliation, Result } from '../Admin';
import { Cancel, Status } from '../CancelDonation';
import { CharityService } from '../charity.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  charitiesArray: Array<Result>;
  bnsArray: Array<string>; 
  cNamesArray: Array<string>;
  count: number = 0;
  i: number = 0;

  // public admin: Admin;
  // public result: Result;
  public recon: Reconciliation;

  querySub2: any;
  querySub3: any;
  querySub4: any;
  cancel: Cancel;
  donationStatusConfirmed: Status;
  donationStatusFailed: Status;

  // @ViewChild('amount') myAmount: ElementRef;
  // flag = true;

  constructor(private data: CharityService, private router: Router) { }

  ngOnInit(): void {

    // this.admin = {
    //   email: ""
    // }
    const donationCols = document.getElementById("donationCols");
    const reconciliation = document.getElementById("reconciliation");

    this.cancel = {
      cancelID: ""
    }

    this.donationStatusConfirmed = {
      status: "confirmed"
    }

    this.donationStatusFailed = {
      status: "failed"
    }

    this.recon = {
      pickupid: "",
      donorid: "",
      adminid: "",
      businessnumber: "",
      amount: 0
    }

    this.bnsArray = [];
    this.cNamesArray = [];

    var userAdmin = localStorage.getItem('admin');

    console.log(userAdmin);

    if(userAdmin == "true"){

    this.data.getAllDonations().subscribe(myData => {
      if (myData) {
        this.charitiesArray = myData.results;
        
        for(var j = 0; j < this.charitiesArray.length; j++){
          if(this.charitiesArray[this.i].donations[0] != undefined){
            this.justTry(j);
          }
        }

        if(this.charitiesArray.length != this.cNamesArray.length){
          this.randomme();
        }
      }
    });

    if(donationCols){
      donationCols.style.display = "block";
    }

    if(reconciliation){
      reconciliation.style.display = "none";
    }

  }else{
    this.router.navigate(['/home']);
  }

  // console.log(this.myAmount.nativeElement.innerHTML);

  }

  async justTry(j: number){
    this.querySub4 = this.data.getCharityByBn(this.charitiesArray[j].donations[0].businessnumber).subscribe(data => {
      this.cNamesArray.push(data.charity.legalname);
    });

    console.log(this.cNamesArray);
  }

  async randomme(){
    if(this.charitiesArray.length != this.cNamesArray.length){
      
      setTimeout(() => {
        this.randomme();
      }, 1000);

      
    }else{
      this.passJ();
    }
  }

  passJ(){
    for(var q = 0; q < this.cNamesArray.length; q++){
      this.charitiesArray[q].phone = this.cNamesArray[q];
    }

    console.log(this.charitiesArray);
  }


  // formSubmit(f: NgForm){

  //   const eError = document.getElementById("eError");
  //   const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;
  //   const successError = document.getElementById("successError");

  //   if(f.invalid){
  //     console.log("Error in form submission");
  //     return;
  //   }
  //   else if(eError && !eRegex.test(this.admin.email)){
  //     eError.innerHTML = "Only Gmail address is allowed";
  //   }
  //   else{

  //     // this.data.getAllDonationsByDonorId(this.admin.email).subscribe(myData => {
  //     //   if (myData) {
  //     //     this.charitiesArray = myData.results;

  //     //     // this.dataCopy(this.charitiesArray);
  //     //   }
  //     // }
  //     this.data.getAllDonations().subscribe(myData => {
  //       if (myData) {
  //         this.charitiesArray = myData.results;

  //         // this.dataCopy(this.charitiesArray);
  //       }
  //     }, err => {
  //       if(err.status == 500){
  //         console.log("500 Error");

  //         if(successError)
  //           successError.innerHTML = "Please enter valid Donation ID"
  //       }
  //       if(err.status == 401){
  //         console.log("401 Error");

  //         if(successError)
  //           successError.innerHTML = "User is not authorized to perform this action"
  //       }
  //       if(err.status == 400){
  //         console.log("400 Error");

  //         if(successError)
  //           successError.innerHTML = "Error in submission. Please try again later"
  //       }
  //       if(err.status == 422){
  //         console.log("422 Error");

  //         if(successError)
  //           successError.innerHTML = "Please enter valid Donor Email Address"
  //       }
  //     });

  //     //f.resetForm();

  //     if(eError)
  //       eError.innerHTML = "";
  //   }
  // }



  confirmDonationReconciliation(pickupID, f: NgForm, donorID, businessNum){
    const donationCols = document.getElementById("donationCols");
    const reconciliation = document.getElementById("reconciliation");

    if(donationCols){
      donationCols.style.display = "none";
    }
    
    if(reconciliation){
      reconciliation.style.display = "block";
    }
    
    this.recon.pickupid = pickupID;
    this.recon.donorid = donorID;
    this.recon.adminid = "polisuk@gmail.com";
    this.recon.businessnumber = businessNum;

    alert("Now confirm the Donation Reconciliation");
  }

  confirmDonation(pickupID, f: NgForm, donorID, businessNum){
    if(f.valid){
      this.recon.pickupid = pickupID;
      this.recon.donorid = donorID;
      this.recon.adminid = "polisuk@gmail.com";
      this.recon.businessnumber = businessNum;
      // this.recon.amount = amt.innerHTML

      this.querySub2 = this.data.createDonationReconciliation(this.recon).subscribe();

      this.querySub3 = this.data.cancelDonationById(pickupID, this.donationStatusConfirmed).subscribe(myData => {
        if(myData){
          window.alert(`The donation with pickup ID: ${pickupID} is Confirmed. An email has been sent to the user at ${donorID} with donation details.`);

          this.ngOnInit();
        }
      });

      this.ngOnInit();
    }else{
      console.log("Form validation errors");
      return;
    }
  }

  seeAllDonations(){
    this.ngOnInit();
  }

  failedDonation(pickupID, donorID){
    this.querySub2 = this.data.cancelDonationById(pickupID, this.donationStatusFailed).subscribe(myData => {
      if(myData){
        window.alert(`The donation with pickup ID: ${pickupID} is Failed. An email has been sent to the user at ${donorID} with donation details.`);

        this.ngOnInit();
      }
    });
  }

}
