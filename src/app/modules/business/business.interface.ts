import { Model, Types } from 'mongoose';

export type IUserPic = {
  imageUrl: string;
  uploadedBy: Types.ObjectId;
  uploadedAt?: Date;
};

export type IBusiness = {
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  coverPhoto?: string;
  address?: string;
  images?: IUserPic[];
  owner: Types.ObjectId;
  isApproved?: boolean;
};

export type BusinessModel = Model<IBusiness>;
