import { Model } from "mongoose";
import { MembershipStatus, MembershipType } from "./membershipApplication..constant";

export type IFamilyMember = {
  name: string;
  relation: string;
};

export type IMemberShipApplication = {
  _id?: string; // optional because Mongoose will generate it
  memberShipId?: string; // AC-01144
  name: string;
  email: string;
  phone: string;
  password: string; // store hashed password, remove confirmPassword from model
  membershipType: MembershipType;
  membershipStatus: MembershipStatus;
  expireId?: Date;   // new field for separate expiry date

  familyMembers?: IFamilyMember[]; // Added family members

  createdAt?: Date;
  updatedAt?: Date;
};


export type MemberShipApplicationModel = Model<IMemberShipApplication>;

