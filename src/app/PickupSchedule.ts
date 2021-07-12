export interface Donation {
    businessnumber: string;
    percent: number;
}

export interface PickupSchedule {
    username: string;
    contactname: string;
    address: string;
    city: string;
    province: string;
    postalcode: string;
    phone: string;
    items: string[];
    donations: Donation[];
    pickupdate: Date;
    pickuptime: string;
}