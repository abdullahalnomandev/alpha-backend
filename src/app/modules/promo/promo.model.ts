import { model, Schema } from 'mongoose';
import { IPromo, PromoModel } from './promo.interface';

const promoSchema = new Schema<IPromo, PromoModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    description:{
      type:String
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    promoCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    QRCode: {
      type: String,
      trim: true,
    },
    generatePromocode: {
      type: Boolean,
      default: true,
    },
    generateQrCode: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Promo = model<IPromo, PromoModel>('Promo', promoSchema);


