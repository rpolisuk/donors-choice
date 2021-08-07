import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CharityService } from '../charity.service';
import { Reset } from '../Reset';
import { Config } from '../Response';
import { SessionService } from '../session.service';
@Component({
  selector: 'app-req-reset',
  templateUrl: './req-reset.component.html',
  styleUrls: ['./req-reset.component.css']
})
export class ReqResetComponent implements OnInit {
  public formData: Reset = new Reset();

  public querySub: any;

  config : Config | undefined ;

  // success: boolean = false;
  
  constructor(private auth:AuthService,private data: CharityService, private router: Router, private http: HttpClient, private session: SessionService) { }

  ngOnInit(): void {

    this.formData = {
      email: ""
    }

  }

  formSubmit(f: NgForm){

    var x = 0;

    const eError = document.getElementById("eError");
    const eRegex = /[a-z0-9]((\.|\_)?[a-z0-9]){3,}@g(oogle)?mail\.com$/;
    const cancelError = document.getElementById("cancelError");

    if(f.invalid){
      console.log("Form validation errors");

      if(eError){
        eError.innerHTML = "";
      }
      return;
    }
    else if(eError && !eRegex.test(this.formData.email)){
      eError.innerHTML = "Only Gmail address is allowed"
      // f.invalid;
      console.log("Email error");
    }
    else{

      if(eError){
        eError.innerHTML = "";
      }

      // this.success = true;

      this.http.post<any>('https://arcane-escarpment-54741.herokuapp.com/users/forgot', {
            "username": this.formData.email
          }
          ,{observe: 'response'}).subscribe(error => {
            console.error('There was an error!', error); 
            console.log(error.status); 
            if(error.status == 422){
              if(x==0){
                x = 1;
                if(eError){
                  eError.innerHTML = "No Account with that email exists";
                }

                // alert("No Account with that username exists");
              }
            }
            if(error.status == 200){
              if(x==0){
                x = 1;
               alert("Request to reset password was succesfully processed.Please check for your Email...");

               this.router.navigate(['/home']);
             
            }
          }
        },HttpErrorResponse=>{    
          if(HttpErrorResponse.status == 200){
            if(x==0){
              x = 1;
             alert("Request to reset password was succesfully processed.Please check for your Email...");

             this.router.navigate(['/home']);
           
          }
        }
        if(HttpErrorResponse.status == 422){
          if(x==0){
            x = 1;
            if(eError){
              eError.innerHTML = "No Account with that email exists";
            }

            // alert("No Account with that username exists");
          }
        }
  
      })
    }
  }
  
//
}
