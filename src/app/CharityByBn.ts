export interface CharityByBn {
    businessnumber: string;
    legalname: string;
    addressline1: string;
    addressline2: string;
    city: string;
    province: string;
    postalcode: string;
    phone: string;
    _id: string;
}

export interface RootObject {
    found: boolean;
    charity: CharityByBn;
}