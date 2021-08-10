import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CharityService } from '../charity.service';
import { Contact } from '../Contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public formData: Contact = new Contact();
  // public flname: FLName = new FLName();
  public success: boolean = false;

  constructor(private data: CharityService, private router: Router) { }

  ngOnInit(): void {

    this.formData = {
      fname: "",
      lname: "",
      subject: "",
      email: "",
      message: ""
    }

  }


  formSubmit(f: NgForm){

    const eError = document.getElementById("eError");
    const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;

    if(f.invalid){
      console.log("Error in form submission");
      return;
    }
    else if(eError && !eRegex.test(this.formData.email)){
      eError.innerHTML = "Only Gmail address is allowed"
      // f.invalid;
      console.log("I m e in");
    }
    else{
      // this.formData.username = this.flname.firstname + " " + this.flname.lastname;

      this.data.contactRequest(this.formData).subscribe();

      f.resetForm();
      
      this.success = true;

      if(eError)
        eError.innerHTML = "";
    }
  }

}
