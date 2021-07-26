import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CharityService } from '../charity.service';
import { Contact } from '../Contact';
import { UserInfo } from '../Extra';
import { HeaderComponent } from '../header/header.component';
import { Login } from '../Login';
import { Config } from '../Response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formData: Login = new Login();

  public querySub: any;

  config : Config | undefined ;

  success: boolean = false;
  
  constructor(private auth:AuthService,private data: CharityService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {

    this.formData = {
      email: "",
      password: ""
    }

  }

  formSubmit(f: NgForm){

    var x = 0;

    const eError = document.getElementById("eError");
    const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;
    const cancelError = document.getElementById("cancelError");

    if(f.invalid){
      console.log("Form validation errors");
      return;
    }
    else if(eError && !eRegex.test(this.formData.email)){
      eError.innerHTML = "Only Gmail address is allowed"
      // f.invalid;
      console.log("Email error");
    }
    // else if(this.formData.password.length < 6 || !letter.test(this.formData.password) || !number.test(this.formData.password) || !upper.test(this.formData.password)){
    //   if(passwordError){
    //     passwordError.innerHTML = "Password length must be greater than 6 charaters, it must contain a special character, a number and a capital alphabet"
    //   }

    //   if(eError){
    //     eError.innerHTML = "";
    //   }

    //   console.log("Password error")
    // }
    else{
      // this.querySub = this.data.loginUser(this.formData).subscribe(myData => { 
      //   if(myData){
      //     console.log("Login successfully!")

      //     // this.router.navigate(['/donate']);
      //   }
        
      //   if(eError){
      //     eError.innerHTML = "";
      //   }
      // }

      this.success = true;

      this.http.post<any>('https://arcane-escarpment-54741.herokuapp.com/users/login', {
            "username": this.formData.email,
            "password": this.formData.password
          },{observe: 'response'}).subscribe(error => {
            console.error('There was an error!', error); 
            console.log(error.status); 
            if(error.status == 401){
              if(x==0){
                x = 1;
                // alert("Incorrect Username and/or Password");
                if(cancelError){
                  cancelError.innerHTML = "Incorrect Username and/or Password"
                }
              }
            }
            if(error.status == 200){
              if(x==0){
                x = 1;
              // alert("Log-in successful!");
              var y =""
              this.http.post<any>('https://arcane-escarpment-54741.herokuapp.com/users/login', {
            "username": this.formData.email,
            "password": this.formData.password
          }).subscribe(mydata => {
                if(mydata){

                  y = mydata.token;
                this.auth.setToken(y);  

                this.auth.setUser(this.formData.email);

                

                window.location.assign('/donate');
                }});
             // this.router.navigate(['/donate']);
              // window.location.assign('/donate');
              // this.data.setUserStatus(true);
              // this.head.userActive = true;
              // console.log(this.data.getUserStatus());
            }
          }
        }, HttpErrorResponse => {
        if(HttpErrorResponse.status == 500){
          console.log("500 Error");

          if(cancelError){
            cancelError.innerHTML = "Please enter valid email and password"
          }
        }
        if(HttpErrorResponse.status == 401){
          console.log("401 Error");

          if(cancelError){
            cancelError.innerHTML = "Incorrect Username and/or Password"
          }
        }
        if(HttpErrorResponse.status == 400){
          console.log("400 Error");

          if(cancelError){
            cancelError.innerHTML = "Error in submission. Please try again later"
          }
        }
      })
    }
  }
  
//
}