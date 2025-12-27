import { Model } from "mongoose";
import { MembershipStatus, MembershipType } from "./membershipApplication..constant";

export type IFamilyMember = {
  name: string;
  relation: string;
};

export type IFeature = {
  icon: string;            // Icon representing the feature (e.g. icon name or url)
  title: string;           // "Digital Membership Card", "Exclusive Offers & Discounts", etc.
  description: string;     // e.g. "Access your digital membership card anytime, anywhere"
};

export type IMemberShipPlan = {
  _id?: string;
  logo?: string;                         // Plan-specific logo
  title: string;                         // e.g. "Regular Membership"
  description?: string;                  // e.g. "All essential features for individual professionals"
  subDescription?: string;               // e.g. "With the Regular Membership..." (add for secondary plan description)
  membershipType: MembershipType;        // Use MembershipType enum
  features: IFeature[];
  familyMembers?: IFamilyMember[];       // Optional family members
  createdAt?: Date;
  updatedAt?: Date;
};

export type MemberShipPlanModel = Model<IMemberShipPlan>;
