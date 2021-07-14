export class Admin{
    email: string;
}

export class Result {
    _id: string;
    pickupid: string;
    donorid: string;
    adminid: string;
    businessnumber: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export class RootObj {
    results: Result[];
}