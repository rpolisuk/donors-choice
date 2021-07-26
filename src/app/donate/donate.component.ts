import { Component, OnInit } from '@angular/core';
import { CharityService } from '../charity.service';
import { FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Charity, Root } from '../Charity';
import { Deserializable } from '../shared/models/deserializable.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancel, Status } from '../CancelDonation';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  charitiesArray: Array<Charity>;

  pages: number = 0;
  chrt: Charity;
  querySub: any;

  querySub2: any;
  clickedChrt: Charity;

  page: number = 1;
  cancel: Cancel;
  donationStatus: Status;
  

  constructor(private data: CharityService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // localStorage.setItem('access_token',"");
    var x = localStorage.getItem('access_token');
    if(x == null || x == ""){   // Change CSS/html to make it look better and redirect after few sec to login page
      // this is require to check if the user is received or not
      alert('Unathorized Please Login First'); 
      this.router.navigate(['/login']);
    }else{
      // remove alert
      
    const form2Display = document.getElementById("form2");
    const form3Display = document.getElementById("form3");
    const results = document.getElementById("searchResults");

    this.chrt = {
        _id: "",
        legalname: "",
        businessnumber: "",
        postalcode: "",
        addressline1: "",
        addressline2: "",
        phone: "",
        city: "",
        province: ""
    }

    this.cancel = {
      cancelID: ""
    }

    this.donationStatus = {
      status: "cancelled"
    }

    if(form2Display){
      form2Display.style.display = "none";
    }

    if(form3Display){
      form3Display.style.display = "none";
    }
    
    if(results){
      results.style.display = "none";
    }

  }
  }

  // Hide form1, display form2
  cancelExistingDonation(){
    const formDisplay = document.getElementById("form1");
    const cancel = document.getElementById("cancelBtn");
    const form2Display = document.getElementById("form2");

    if(formDisplay){
      formDisplay.style.display = "none";
    }

    if(form2Display){
      form2Display.style.display = "block";
    }

    if(cancel){
      cancel.style.display = "none";
    }
  }

  // Hide form2, display form1
  makeNewDonation(e){
    const formDisplay = document.getElementById("form1");
    const cancel = document.getElementById("cancelBtn");
    const form2Display = document.getElementById("form2");

    if(formDisplay){
      formDisplay.style.display = "block";
    }

    if(form2Display){
      form2Display.style.display = "none";
    }

    if(cancel){
      cancel.style.display = "block";
    }

    e.preventDefault();
  }

  // Submit button clicked
  donateNow(e){
    e.preventDefault();
  }

  // search for charity
  async searchCharity(e, num){

    const results = document.getElementById("searchResults");

    // this.querySub = await this.data.getAllCharities(num, this.chrt.legalname).subscribe(myData => {
    //   if (myData) {
    //     this.charitiesArray = myData.charities;
    //     this.page = num;
    //     // console.log(this.charitiesArray);
    //   }
    //   else{
    //     if(results){
    //       results.innerHTML = "Sorry, no results found for searched charity"
    //     }
    //   }
    // })

    this.querySub = this.route.queryParams.subscribe(params => {
      this.getPage(+params['page'] || 1);
    });

    e.preventDefault();
  }

  async getPage(num){
    const results = document.getElementById("searchResults");

    this.querySub = await this.data.getAllCharities(num, this.chrt.legalname).subscribe(myData => {
      if (myData) {
        this.pages = myData.totalPages;
        this.charitiesArray = myData.charities;
        this.page = num;
      }

      if(this.pages == 0){
        if(results){
          results.style.display = "block";
          results.innerHTML = "Sorry, no charities found for the searched query."
        }
      }
      else{
        if(results){
          results.style.display = "none";
        }
      }
    })
  }


  formSubmit(e, f: NgForm){

    const cancelError = document.getElementById("cancelError");

    if(!f.invalid){
      this.querySub2 = this.data.cancelDonationById(this.cancel.cancelID, this.donationStatus).subscribe(myData => {
        if(myData){
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 8000);
    
          const form2Display = document.getElementById("form2");
          const form3Display = document.getElementById("form3");
    
          if(form3Display){
            form3Display.style.display = "block";
          }
    
          if(form2Display){
            form2Display.style.display = "none";
          }
        }
      }, err => {
        if(err.status == 500){
          console.log("500 Error");

          if(cancelError)
            cancelError.innerHTML = "Please enter valid Donation ID"
        }
        if(err.status == 401){
          console.log("401 Error");

          if(cancelError)
            cancelError.innerHTML = "User is not authorized to perform this action"
        }
        if(err.status == 400){
          console.log("400 Error");

          if(cancelError)
            cancelError.innerHTML = "Error in submission. Please try again later"
        }
      }
      );

      

      e.preventDefault();
    }
    else{
      console.log("Form errors");
    }
  }


  // selected charity
  // selectedCharity(){
  //   this.querySub2 = this.route.params.subscribe(params =>{
  //     this.data.getCharitybyId(params['businessnumber']).subscribe(myData => {
  //       this.clickedChrt = myData;
  //       this.chrt.legalname = this.clickedChrt.legalname;
  //     });
  //   })
  // }

}
