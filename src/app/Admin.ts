// export class Admin{
//     email: string;
// }

export class Donation {
    businessnumber: string;
    percent: number;
    _id: string;
}

export class Result {
    items: string[];
    status: string;
    _id: string;
    username: string;
    contactname: string;
    address: string;
    city: string;
    province: string;
    postalcode: string;
    phone: string;
    donations: Donation[];
    pickupdate: Date;
    pickuptime: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export class RootObj {
    results: Result[];
}

export class Reconciliation{
    pickupid: string;
    donorid: string;
    adminid: string;
    businessnumber: string;
    amount: number;
}