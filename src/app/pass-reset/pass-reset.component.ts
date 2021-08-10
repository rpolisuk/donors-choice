import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CharityService } from '../charity.service';
import { PassReset } from '../PassReset';
import { RegisterExtra} from '../Register';
import { Config } from '../Config';
@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.css']
})
export class PassResetComponent implements OnInit {
  public formData: PassReset = new PassReset();
  public formData2: RegisterExtra;
  public querySub: any;
  public querySub2: any;

  token: string;

  config : Config | undefined ;
  constructor(private data: CharityService, private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.formData = {
      email: "",
      password: ""
    }

    this.formData2 = {
      conpassword: ""
    }

    this.querySub2 = this.route.params.subscribe(params =>{
      // this.data.getCharityByBn(params['businessnumber']).subscribe(myData => {
      //   this.clickedChrt = myData.charity;
      //   this.BNcharity = myData.charity.businessnumber;
      //   // console.log(myData.charity);
      // });
      this.token = params['token'];
    })

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
      // var y =""
                  // this.getConfig(this.formData.email).subscribe(mydata => {
                  //   if(mydata){
                  //     y = mydata.resetPasswordToken;
                      this.http.put<any>(`https://arcane-escarpment-54741.herokuapp.com/users/reset/` + this.token,{
                        "password" : this.formData.password
                      },{observe: 'response'}).subscribe(error => {
                        if(error.status == 422){
                          if(x==0){
                            x = 1;
                            alert("Invalid Password Token or Token Expired");

                            this.router.navigate(['/home']);
                          }
                        }
                        if(error.status == 200){
                          if(x==0){
                            x = 1;
                          alert("Request to reset password was succesfully processed.");

                          this.router.navigate(['/login']);
                        }
                        }
                },HttpErrorResponse=>{
                  console.log('its here',HttpErrorResponse);
                  console.log(HttpErrorResponse.status);
                  if(HttpErrorResponse.status == 422){
                    if(x==0){
                      x = 1;
                      alert("Invalid Password Token or Token Expired");

                      this.router.navigate(['/home']);
                    }
                  }
                  if(HttpErrorResponse.status == 200){
                    if(x==0){
                      x = 1;
                    alert("Request to reset password was succesfully processed.");

                    this.router.navigate(['/login']);
                    }
                  }
                })
                    }
                  // });
                  // if(y == null){
                  //   if(y == "")
                  //   alert("Unauthorized")
                  //   alert("Unauthorized");

                  //   alert(this.config)
                  // }else{
                  
                  // }
    }
  // }


 
  // getConfig(emailid: string | null){
  //   return this.http.get<Config>(`https://arcane-escarpment-54741.herokuapp.com/users/get?username=${emailid}`)
  // }

}
