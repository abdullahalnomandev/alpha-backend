import { model, Schema } from 'mongoose';
import { BusinessRequestModel, IBusinessRequest } from './businessRequest.interface';
import { BUSINESS_REQUEST_STATUS } from './businessRequest.constant';

const businessRequestSchema = new Schema<IBusinessRequest, BusinessRequestModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: [BUSINESS_REQUEST_STATUS.PENDING, BUSINESS_REQUEST_STATUS.APPROVED, BUSINESS_REQUEST_STATUS.APPROVED],
      default: 'pending',
    }
  },
  { timestamps: true }
);

export const BusinessRequest = model<IBusinessRequest, BusinessRequestModel>('BusinessRequest', businessRequestSchema);


