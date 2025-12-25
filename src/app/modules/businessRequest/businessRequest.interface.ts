import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IBusinessRequest = {
  name: string; 
  email: string;
  url: string; 
  user: Types.ObjectId | IUser; 
  status?: 'pending' | 'approved' | 'rejected';
};

export type BusinessRequestModel = Model<IBusinessRequest>;


