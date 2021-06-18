import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  onClickSubmit(data: { emailid: string | null; passwd: string | null; cpasswd: string | null; }){
    if(data.emailid == null || data.emailid == "" || data.passwd == "" || data.passwd == null || data.cpasswd == "" || data.cpasswd == null)
    alert("Field/(s) cannot be Empty");
    else{
      var letter = /[@,-,_,!]/;
      var upper  =/[A-Z]/;
      var number = /[0-9]/;
            if(data.passwd.length < 6 || !letter.test(data.passwd) || !number.test(data.passwd) || !upper.test(data.passwd) 
            || data.cpasswd.length < 6 || !letter.test(data.cpasswd) || !number.test(data.cpasswd) || !upper.test(data.cpasswd)) {
              if(data.passwd.length<6)
                alert("Please make sure new password is longer than 6 characters.")
              
              if(!letter.test(data.passwd))
                alert("Please make sure new password includes a special character.")
              
              if(!number.test(data.passwd))
                alert("Please make sure new Password Includes a Digit")
              
              if(!upper.test(data.passwd)) 
                alert("Please make sure new password includes an uppercase letter.");


               if(data.passwd != data.cpasswd){
                 alert("Please make sure Password matches");
               }


            }else{
              if(data.passwd != data.cpasswd){
                alert("Please make sure Password matches");
              }
              var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              if (!filter.test(data.emailid)) {
               alert('Please provide a valid email address');
              }else{
            this.http.post<any>('https://arcane-escarpment-54741.herokuapp.com/users/login', {
              "username": data.emailid,
              "password": data.passwd
            },{observe: 'response'}).subscribe(error => {
                console.error('There was an error!', error); 
                console.log(error.status); 
                if(error.status == 401){
                  alert("Incorrect Username and/or Password");
                }
                if(error.status == 200){
                  alert("Log-in successful!");
                }
        },HttpErrorResponse=>{
          console.log('its here',HttpErrorResponse);
          console.log(HttpErrorResponse.status);
          if(HttpErrorResponse.status == 401){
            alert("Incorrect Username and/or Password");
          }
          if(HttpErrorResponse.status == 200){
            alert("Log-in successful!");
          }
        }
        )
        };
    }
  }
  }
}
