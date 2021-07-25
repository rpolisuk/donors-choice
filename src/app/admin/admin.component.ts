import { Component, OnInit } from '@angular/core';
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

  constructor(private data: CharityService, private router: Router) { }

  ngOnInit(): void {

    // this.admin = {
    //   email: ""
    // }

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

    this.data.getAllDonations().subscribe(myData => {
      if (myData) {
        this.charitiesArray = myData.results;

        for(this.i = 0; this.i < this.charitiesArray.length; this.i++){
          this.querySub4 = this.data.getCharityByBn(this.charitiesArray[this.i].donations[0].businessnumber).subscribe(data => {
            this.cNamesArray.push(data.charity.legalname);
            // this.charitiesArray[this.i].donations[0].businessnumber = this.cNamesArray[this.i];
          });
          // this.charitiesArray[this.i].donations[0].businessnumber = this.cNamesArray[this.i];
        }

        console.log(this.cNamesArray);
        // var count = 0;

        // for(this.j = 0; this.j < this.cNamesArray.length; this.j++){
        //   // this.charitiesArray[j].donations[0].businessnumber = this.cNamesArray[j];
        //   // console.log(this.charitiesArray[j].donations[0].businessnumber);
        //   // console.log(this.cNamesArray[j]);
        //   // this.count++;
        //   // console.log(this.count);
        // }

        // for(var i = 0; i < this.charitiesArray.length; i++){
        //   this.bnsArray.push(this.charitiesArray[i].donations[0].businessnumber);
        //   console.log(this.bnsArray);
        // }

        // for(var i = 0; i < this.bnsArray.length; i++){ 
        //   this.querySub4 = this.data.getCharityByBn(this.bnsArray[i]).subscribe(myData => {
        //     this.cNamesArray.push(myData.charity.legalname);
        //   });
        //   console.log(this.cNamesArray);
        // }

        

        

        // console.log(this.cNamesArray);
        // console.log(this.charitiesArray);
      }

      // for(var j = 0; j < this.cNamesArray.length; j++){
      //   this.charitiesArray[j].donations[0].businessnumber = this.cNamesArray[j];
      //   console.log("Hello");
      // }
    });

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


  confirmDonation(pickupID, f: NgForm, donorID, businessNum){
    if(f.valid){

      this.recon.pickupid = pickupID;
      this.recon.donorid = donorID;
      this.recon.adminid = "adminID";
      this.recon.businessnumber = businessNum;

      this.querySub2 = this.data.createDonationReconciliation(this.recon).subscribe();

      this.querySub3 = this.data.cancelDonationById(pickupID, this.donationStatusConfirmed).subscribe(myData => {
        if(myData){
          window.alert(`The donation with pickup ID: ${pickupID} is Confirmed. An email has been sent to the user with donation details.`);
        }
      });
    }else{
      console.log("Form validation errors");
      return;
    }
  }

  failedDonation(pickupID){
    this.querySub2 = this.data.cancelDonationById(pickupID, this.donationStatusFailed).subscribe(myData => {
      if(myData){
        window.alert(`The donation with pickup ID: ${pickupID} is Failed. An email has been sent to the user with donation details.`);
      }
    });
  }


  // dataCopy(cArray: Array<Result>){
  //   for(var i = 0; i < this.charitiesArray.length; i++){
  //     cArray[i].pickupid = this.charitiesArray[i].pickupid;
  //     cArray[i].donorid = this.charitiesArray[i].donorid;
  //     cArray[i].adminid = this.charitiesArray[i].adminid;
  //     cArray[i].businessnumber = this.charitiesArray[i].businessnumber;
  //     cArray[i].amount = this.charitiesArray[i].amount;
  //   }

  //   for(var i = 0; i < cArray.length; i++){
  //     this.charitiesArray[i].pickupid = cArray[i].pickupid;
  //     this.charitiesArray[i].donorid = cArray[i].donorid;
  //     this.charitiesArray[i].adminid = cArray[i].adminid;
  //     this.charitiesArray[i].businessnumber = cArray[i].businessnumber;
  //     this.charitiesArray[i].amount = cArray[i].amount;
  //   }

  //   return this.charitiesArray;
  // }

}
