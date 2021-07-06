import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Charity } from './Charity';
// import 'rxjs/add/operator/map';


const limit = 30;

@Injectable({
  providedIn: 'root'
})
export class CharityService {

  constructor(private http: HttpClient) { }

  // Get Charities
  // getAllCharities(): Observable<any>{
  //   return this.http.get<any>(`https://salty-tundra-66737.herokuapp.com/api/categories`);
  // }

  getAllCharities(legalname): Observable<Charity[]>{

    let params = {
      // page: page,
      // limit: limit.toString(),
    }

    // Check value for "charity" 
    if (legalname != null || legalname != undefined) {
      params["legalname"] = legalname;
    }

    return this.http.get<Charity[]>(`https://arcane-escarpment-54741.herokuapp.com/charities`, {params});

  }

}

