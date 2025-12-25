import { Model } from "mongoose";
import { MembershipStatus, MembershipType } from "./membershipApplication..constant";

export type IFamilyMember = {
  name: string;
  relation: string;
};

export type IFeature = {
  icon: string;
  title: string;
  description: string;
};

export type IMemberShipPlan = {
  _id?: string; // optional because Mongoose will generate it
  title?: string;
  planDescription?: string; // added planDescription
  logo?: string; // added logo
  features: IFeature[];
  createdAt?: Date;
  updatedAt?: Date;
};
