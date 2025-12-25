import { model, Schema } from 'mongoose';
import { BusinessModel, IBusiness } from './business.interface';

const userPicSchema = new Schema({
  imageUrl: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, required: true }
}, { _id: false });

const businessSchema = new Schema<IBusiness, BusinessModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number] as unknown as [number, number],
        required: true
      }
    },
    coverPhoto: {
      type: String,
    },
    address: {
      type: String,
    },
    images: [userPicSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


businessSchema.index({ location: "2dsphere" });

export const Business = model<IBusiness, BusinessModel>('Business', businessSchema);
