import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IPromo = {
  user: Types.ObjectId | IUser;
  title: string;
  description?: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  generatePromocode: boolean;
  generateQrCode: boolean;
  active: boolean;
  promoCode:string;
  QRCode:string;
  
};

export type PromoModel = Model<IPromo>;


