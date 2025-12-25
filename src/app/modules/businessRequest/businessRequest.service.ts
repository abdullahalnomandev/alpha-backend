import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { IBusinessRequest } from './businessRequest.interface';
import { BusinessRequest } from './businessRequest.model';
import { mongo } from 'mongoose';
import { buesinessRequestSearchableFields } from './businessRequest.constant';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';

const createToDB = async (payload: IBusinessRequest, userId: mongo.ObjectId) => {


  
  const isExist = await BusinessRequest.findOne({ user: userId });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Business request already submitted for this user');
  }

  payload.user = userId;
  console.log(payload)

  return await BusinessRequest.create(payload);
};

const updateInDB = async (id: string, payload: Partial<IBusinessRequest>) => {
  console.log(payload)
  const updated = await BusinessRequest.findByIdAndUpdate(id, payload, { new: true });

  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Business request not found');
  } else{
     await User.findByIdAndUpdate(updated?.user, {role:USER_ROLES.BUSINESS},{new:true})
  }
  return updated;
};

const deleteFromDB = async (id: string) => {
  const deleted = await BusinessRequest.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Business request not found');
  }
  return deleted;
};

const getAllFromDB = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(BusinessRequest.find().populate('user', 'name email'), query)
    .paginate()
    .search(buesinessRequestSearchableFields)
    .fields()
    .filter()
    .sort();
  const data = await qb.modelQuery.lean();
  const pagination = await qb.getPaginationInfo();
  return { pagination, data };
};

const getByIdFromDB = async (id: string) => {
  const doc = await BusinessRequest.findById(id).populate('user', 'name email');
  if (!doc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Business request not found');
  }
  return doc;
};

export const BusinessRequestService = {
  createToDB,
  updateInDB,
  deleteFromDB,
  getAllFromDB,
  getByIdFromDB,
};


