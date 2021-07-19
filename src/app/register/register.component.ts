import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CharityService } from '../charity.service';
import { Register, RegisterExtra } from '../Register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formData: Register = new Register();
  public formData2: RegisterExtra;
  public querySub: any;

  constructor(private data: CharityService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {

    this.formData = {
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    }

    this.formData2 = {
      conpassword: ""
    }

  }


  formSubmit(f: NgForm){
    
    const eError = document.getElementById("eError");
    const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;
    const conpassError = document.getElementById("conpassError");
    const letter = /[@,-,_,!,$,#,^,*]/;
    const upper  =/[A-Z]/;
    const number = /[0-9]/;
    const passwordError = document.getElementById("passwordError");

    var x = 0;

    if(f.invalid){
      console.log("Form validation errors");
      return;
    }
    else if(eError && !eRegex.test(this.formData.email)){
      eError.innerHTML = "Only Gmail address is allowed"
      // f.invalid;
      console.log("I m e in");
    }
    else if(this.formData.password.length < 6 || !letter.test(this.formData.password) || !number.test(this.formData.password) || !upper.test(this.formData.password)){
      if(passwordError){
        passwordError.innerHTML = "Password length must be greater than 6 charaters, it must contain a special character, a number and a capital alphabet"
      }

      if(eError)
        eError.innerHTML = "";
    }
    else if(this.formData.password != this.formData2.conpassword){
      if(conpassError)
      conpassError.innerHTML = "Password & Confirm password must match";

      if(passwordError)
        passwordError.innerHTML = "";
    }
    else{
      // this.querySub = this.data.registerUser(this.formData).subscribe(() => this.router.navigate(['/donate']));

      this.http.post<any>('https://arcane-escarpment-54741.herokuapp.com/users/signup', {
          "firstname": this.formData.firstname,
          "lastname": this.formData.lastname,
          "username": this.formData.email,
          "password": this.formData.password
        },{observe: 'response'}).subscribe(error => {
              if(error.status == 401){
                if(x==0){
                  x = 1;
                alert("Incorrect Username and/or Password");}
              }
              if(error.status == 200){
                if(x==0){
                  x = 1;
                alert("Sign-up Successful!");

                this.router.navigate(['/donate']);
              }
              }
    },HttpErrorResponse=>{    
        if(HttpErrorResponse.status == 200){
          if(x==0){x =1 
        alert("Sign-up Successful!");}
      }
      if(HttpErrorResponse.status == 422){
        if(x==0){x =1 
        alert("Email is already taken!");}
      }

    })

      if(conpassError)
        conpassError.innerHTML = "";

      if(passwordError)
        passwordError.innerHTML = "";
    }
  }

}
