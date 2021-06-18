import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Roles: any = ['Ontario', 'Quebec', 'Alberta','British Columbia','Manitoba','New Brunswick','New FoundLand and labrador','Nunavat','Nova Scotia','Yukon','Northwestern Terretories','Prince Edward Island','Saskatchewan'];

  constructor(private http: HttpClient) { }

  ngOnInit(){
  }
  onClickSubmit(data: { emailid: string | null; passwd: string | null; Fname: string | null; Lname: string | null; cpasswd: string | null; phone: string | null; }){
    if(data.emailid == null || data.emailid == "" || data.passwd == "" || data.passwd == null 
      || data.Fname == null || data.Fname == "" || data.Lname == "" || data.Lname == null
      ||data.cpasswd == null || data.cpasswd == "" )//|| data.phone == "" || data.phone == null)
     // 1 != 1)
    alert("Field/(s) cannot be Empty");
    else{
      var letter = /[@,-,_,!]/;
var upper  =/[A-Z]/;
var number = /[0-9]/;
      if(data.passwd.length < 6 || data.passwd != data.cpasswd || !letter.test(data.passwd) || !number.test(data.passwd) || !upper.test(data.passwd)) {
        if(data.passwd.length<6)
          alert("Please make sure password is longer than 6 characters.")
        
        if(data.passwd != data.cpasswd)
          alert("Please make sure passwords match.")
        
        if(!letter.test(data.passwd))
          alert("Please make sure password includes a special character.")
        
        if(!number.test(data.passwd))
          alert("Please make sure Password Includes a Digit")
        
        if(!upper.test(data.passwd)) 
          alert("Please make sure password includes an uppercase letter.");
          
      }else{
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!filter.test(data.emailid)) {
           alert('Please provide a valid email address');
          }else{
        this.http.post<any>('https://arcane-escarpment-54741.herokuapp.com/users/signup', {
          "firstname": data.Fname,
          "lastname": data.Lname,
          "username": data.emailid,
          "password": data.passwd
        },{observe: 'response'}).subscribe(error => {
            console.error('There was an error!', error); 
            console.log(error.status); 
    },HttpErrorResponse=>{
      console.log('its here',HttpErrorResponse);
      console.log(HttpErrorResponse.status);
      if(HttpErrorResponse.status == 422){
        alert("User name already taken!");
      }
      if(HttpErrorResponse.status == 200){
        alert("Sign up successful!");
      }
    }
    )
    };
      };
    }
  }
}

// Ronak     Rushi     Karan    Jaiv      Dharmik
//    43         74       31      67           68
//    12         11        0      10            0
//    10         13        0      11           11
//    11         12        0       0           11
//     0         12        0       0           11 
//    11         10       11       0           11
//    11         10        0      10            0
//    10         10       10      11           11
//    10         10       10       0           10
//    75         88       31      42           65