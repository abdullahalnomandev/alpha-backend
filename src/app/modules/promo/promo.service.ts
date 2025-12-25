import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { IPromo } from './promo.interface';
import { Promo } from './promo.model';
import mongoose from 'mongoose';
import { generatePromocode, generateQrCode } from './promo.util';

const createToDB = async (payload: IPromo, userId: mongoose.Types.ObjectId) => {


  const existingPromo = await Promo.findOne({ user: userId }, "_id").lean();
  if (existingPromo) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Promo already exists for this user');
  }

  if (new Date(payload.endDate).getTime() < new Date(payload.startDate).getTime()) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'endDate must be after startDate');
  }


  payload.user = userId;

  if (payload.generatePromocode) {
    const generatedPromoCode = await generatePromocode();
    payload.promoCode = generatedPromoCode;
  }

  if (payload.generateQrCode) {
    const data = { title: payload.title, description: payload.description, discount: payload.discount }
    const generatedQRCode = await generateQrCode(data, String(userId))
    payload.QRCode = generatedQRCode
  }


  return await Promo.create(payload);
};

const updateInDB = async (payload: Partial<IPromo>, userId: mongoose.Types.ObjectId) => {
  if (payload.startDate && payload.endDate) {
    if (new Date(payload.endDate).getTime() < new Date(payload.startDate).getTime()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'endDate must be after startDate');
    }
  }

  if (payload.generatePromocode) {
    const generatedPromoCode = await generatePromocode();
    payload.promoCode = generatedPromoCode;
  } else {
    payload.promoCode = '';
  }

  if (payload.generateQrCode) {
    const data = { title: payload.title, description: payload.description, discount: payload.discount }
    const generatedQRCode = await generateQrCode(data, String(userId));
    payload.QRCode = generatedQRCode;
  } else {
    payload.QRCode = '';
  }

  console.log(payload)

  const updated = await Promo.findOneAndUpdate(
    { user: userId },
    { $set: payload, $setOnInsert: { user: userId } },
    { new: true, upsert: true }
  );

  return updated;
};


const deleteFromDB = async (userId: mongoose.Types.ObjectId) => {
  const deleted = await Promo.findOneAndDelete(userId);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Promo not found');
  }
  return deleted;
};

const getAllFromDB = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(Promo.find(), query)
    .paginate()
    .search(['title'])
    .fields()
    .filter()
    .sort();
  const data = await qb.modelQuery.lean();
  const pagination = await qb.getPaginationInfo();
  return { pagination, data };
};

const getByIdFromDB = async (id: mongoose.Types.ObjectId) => {

  console.log({ id })

  const doc = await Promo.findOne({ user: id }).populate('user', 'name email profileImage').lean();
  if (!doc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Promo not found');
  }
  return doc;
};

export const PromoService = {
  createToDB,
  updateInDB,
  deleteFromDB,
  getAllFromDB,
  getByIdFromDB,
};


