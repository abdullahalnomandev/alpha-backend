import { model, Schema } from 'mongoose';
import { ContactModel, IContact } from './contact.interface';

const contactSchema = new Schema<IContact, ContactModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Contact = model<IContact, ContactModel>('Contact', contactSchema);


