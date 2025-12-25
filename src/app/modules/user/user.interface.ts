import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import mongoose from 'mongoose';
export type IUser = {
  _id?:string;
  name: string;
  profileImage?: string;
  email: string;
  password: string;
  confirmPassword:string;
  status?: 'active' | 'block';
  role?: USER_ROLES;
  verified?: boolean;
  preferences?: mongoose.ObjectId[];
  restaurant_crowd_status?: 'normal' | 'high' | 'overloaded';
  authentication?: {
    isResetPassword?: boolean;
    oneTimeCode?: number | null;
    expireAt?: Date | null;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;