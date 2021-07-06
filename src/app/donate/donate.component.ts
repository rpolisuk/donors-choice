import { Component, OnInit } from '@angular/core';
import { CharityService } from '../charity.service';
import { FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Charity } from '../Charity';
import { Deserializable } from '../shared/models/deserializable.model';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  charitiesArray: Array<Charity>;

  // charities: Array<any>;
  chrt: Charity;
  // private charityArray;
  querySub: any;
  res: Object = {};

  constructor(private data: CharityService) { }

  ngOnInit(): void {
    const form2Display = document.getElementById("form2");

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

    if(form2Display){
      form2Display.style.display = "none";
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

  // onSubmit(f: NgForm){
  //   console.log(f);
  // }

  // search for charity
  searchCharity(e){
    const results = document.getElementById("searchResults");

    this.querySub = this.data.getAllCharities(this.chrt.legalname).subscribe(myData => {
      if(myData.length > 0){
        this.charitiesArray = myData;
        // this.page = num;
        // let json = JSON.stringify(this.charitiesArray);
        // console.log(json);

        // for (var i = 0; i < this.charitiesArray.length; i++) {
        //   this.res[this.charitiesArray[i].businessnumber] = this.charitiesArray[i].legalname;
        // }

        // console.log(this.res);

      }
      else{
        if(results){
          results.innerHTML = "Sorry, no results found for searched charity"
        }
      }
    })

    const resObj = Object.assign({}, this.charitiesArray);

    console.log(resObj);

    e.preventDefault();
  }

}
