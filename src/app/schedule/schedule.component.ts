import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharityByBn } from '../CharityByBn';
import { CharityService } from '../charity.service';
import { PickupSchedule, Donation } from '../PickupSchedule';
import { Option } from '../Extra';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  querySub: any;

  querySub2: any;
  clickedChrt: CharityByBn;

  // charity: Array<Donation>;
  BNcharity: string;

  donation: PickupSchedule;
  page: number = 1;

  option: Option;
  // public formData: FormData = new FormData();

  todayDate: Date = new Date();


  constructor(private data: CharityService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    const form2Display = document.getElementById("form2");

    this.donation = {
        username: "",
        contactname: "",
        address: "",
        city: "City",
        province: "Province",
        postalcode: "",
        phone: "",
        items: [],
        donations: [],
        pickupdate: new Date(),
        pickuptime: "Morning"
    }

    this.option = {
      men: true,
      women: false,
      children: false,
      terms: false
    }

    this.querySub2 = this.route.params.subscribe(params =>{
      this.data.getCharityByBn(params['businessnumber']).subscribe(myData => {
        this.clickedChrt = myData.charity;
        this.BNcharity = myData.charity.businessnumber;
        // console.log(myData.charity);
      });
    })

    if(form2Display){
      form2Display.style.display = "none";
    }
    
  }

  // City value changed
  cityChanged(city: string){
    if(city == "Toronto"){
      this.donation.province = "Ontario";
    }
    if(city == "Montreal"){
      this.donation.province = "Quebec";
    }
    if(city == "Vancouver"){
      this.donation.province = "British Columbia";
    }
    if(city == "Calgary"){
      this.donation.province = "Alberta";
    }
    if(city == "Edmonton"){
      this.donation.province = "Alberta";
    }
    if(city == "Ottawa???Gatineau"){
      this.donation.province = "Ontario";
    }
    if(city == "Winnipeg"){
      this.donation.province = "Manitoba";
    }
    if(city == "Quebec City"){
      this.donation.province = "Quebec";
    }
    if(city == "Hamilton"){
      this.donation.province = "Ontario";
    }
    if(city == "Kitchener???Waterloo???Cambridge"){
      this.donation.province = "Ontario";
    }
    if(city == "London"){
      this.donation.province = "Ontario";
    }
    if(city == "Victoria"){
      this.donation.province = "British Columbia";
    }
    if(city == "Halifax"){
      this.donation.province = "Nova Scotia";
    }
    if(city == "Oshawa"){
      this.donation.province = "Ontario";
    }
    if(city == "Windsor"){
      this.donation.province = "Ontario";
    }
  }

  // Submit button clicked
  donateNow(e, f: NgForm){
    const men = document.querySelector("#men:checked");
    const women = document.querySelector("#women:checked");
    const children = document.querySelector("#children:checked");
    const terms = document.getElementById("#terms:checked");

    const formDisplay = document.getElementById("form1");
    const cancel = document.getElementById("cancelBtn");
    const form2Display = document.getElementById("form2");

    const items = document.getElementById("items");
    const items2 = document.getElementById("items2");
    const items3 = document.getElementById("items3");

    const sCity = document.getElementById("selectedCity");
    const sProvince = document.getElementById("selectedProvince");

    const pError = document.getElementById("pError");
    const eError = document.getElementById("eError");
    const pRegex = /^\d{10}$/;
    const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;

    const dError = document.getElementById("donateError");

    
    if(f.invalid){
      console.log("Validation errors");

      if(dError){
        dError.innerHTML = "All fields are required!";
      }
    }

    else if(pError && !pRegex.test(this.donation.phone)){
          pError.innerHTML = "Only numbers and up to 10 digits";
          // f.invalid;
          console.log("I m e in");

          if(dError){
            dError.innerHTML = "Phone field only allow numbers and up to 10 digits";
          }
        }

    else if(eError && !eRegex.test(this.donation.username)){
          eError.innerHTML = "Only Gmail address is allowed";
          
          if(pError)
            pError.innerHTML = "";
          // f.invalid;
          console.log("I m e in");

          if(dError){
            dError.innerHTML = "Only Gmail address is allowed";
          }
        }
      
    
    else if(this.donation.city == "City"){
        if(sCity){
          sCity.innerHTML = "City is required";
          console.log("City");
        }

        if(eError){
          eError.innerHTML = "";
        }

        if(dError){
          dError.innerHTML = "City is required";
        }
    }
    else if(this.donation.province == "Province"){
        if(sProvince){
          sProvince.innerHTML = "Province is required";
          console.log("Province");
        }

        if(sCity){
          sCity.innerHTML = "";
        }

        if(dError){
          dError.innerHTML = "Province is required";
        }
    }
    else if(this.option.men == false && this.option.women == false && this.option.children == false){

      if(items && items2 && items3){
        items.innerHTML = "Please select any clothings to donate";
        items2.innerHTML = "Please select any clothings to donate";
        items3.innerHTML = "Please select any clothings to donate";
      }

      if(sProvince){
        sProvince.innerHTML = "";
      }

      if(dError){
        dError.innerHTML = "Please select any clothings to donate";
      }
    
    }
    // else if(this.option.terms == false){

    //   if(terms){
    //     terms.innerHTML = "Please accept the Terms and Conditions to make a donation";
    //   }

    // }
    else{

      if(dError){
        dError.innerHTML = "";
      }
      
      if(men){
        if(men != null){
          this.donation.items.push("men");
        }
      }

      if(women){
        if(women != null){
          this.donation.items.push("women");
        }
      }

      if(children){
        if(children != null){
          this.donation.items.push("children");
        }
      }

      this.donation.donations.push({
        businessnumber: this.BNcharity,
        percent: 100
      })


      // Data submission
      this.data.newDonation(this.donation).subscribe(() => setTimeout(() => {
        this.router.navigate(['/home']);
      }, 8000));


      // Display Thank you message
      if(formDisplay){
        formDisplay.style.display = "none";
      }

      if(form2Display){
        form2Display.style.display = "block";
      }

      if(cancel){
        cancel.style.display = "none";
      }


      // Form validation
      // if(f.invalid){
      //   console.log("Error in form submission");
      //   return;
      // }
      // else{
      //   f.resetForm();
      // }

    }

    e.preventDefault();
  }

}
