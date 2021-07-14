import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin, RootObj } from './Admin';
import { Cancel, Status } from './CancelDonation';
import { Charity, Root } from './Charity';
import { CharityByBn, RootObject } from './CharityByBn';
import { Contact } from './Contact';
import { Option } from './Extra';
import { PickupSchedule } from './PickupSchedule';
// import 'rxjs/add/operator/map';


const limit = 5;

@Injectable({
  providedIn: 'root'
})
export class CharityService {

  constructor(private http: HttpClient) { }

  // Get Charities
  // getAllCharities(): Observable<any>{
  //   return this.http.get<any>(`https://salty-tundra-66737.herokuapp.com/api/categories`);
  // }

  getAllCharities(page, legalname): Observable<Root>{

    let params = {
      page: page,
      limit: limit.toString(),
    }

    // Check value for "charity"
    if (legalname != null || legalname != undefined) {
      params["legalname"] = legalname;
    }

    return this.http.get<Root>(`https://arcane-escarpment-54741.herokuapp.com/charities`, {params});

  }

  // Get Charity By ID
  getCharityByBn(businessnumber): Observable<RootObject>{
    return this.http.get<RootObject>(`https://arcane-escarpment-54741.herokuapp.com/charities/byBN?businessnumber=${businessnumber}`);
  }

  // Make New Donation
  newDonation(data: PickupSchedule): Observable<any>{
    return this.http.post<any>(`https://arcane-escarpment-54741.herokuapp.com/pickups/schedule`, data);
  }

  // Cancel Donation By ID
  cancelDonationById(cancelId: string, data: Status): Observable<any>{
    return this.http.put<any>(`https://arcane-escarpment-54741.herokuapp.com/pickups/update/${cancelId}`, data);
  }

  // Contact Form request
  contactRequest(data: Contact): Observable<any>{
    return this.http.post<any>(`https://arcane-escarpment-54741.herokuapp.com/pickups/schedule`, data);
  }

  // Get All Donations of Donor
  getAllDonationsByDonorId(donorId): Observable<RootObj>{
    return this.http.get<RootObj>(`https://arcane-escarpment-54741.herokuapp.com/donations/history?donorid=${donorId}`);
  }

}

