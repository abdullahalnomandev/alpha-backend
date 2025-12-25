import { Model } from 'mongoose';

export type IContact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  resolved?: boolean;
};

export type ContactModel = Model<IContact>;


