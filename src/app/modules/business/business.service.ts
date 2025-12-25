import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { IBusiness } from './business.interface';
import { Business } from './business.model';
import mongoose from 'mongoose';
import { getLatLongWithLocalRequest } from './business.util';
import { Promo } from '../promo/promo.model';
import { IPromo } from '../promo/promo.interface';
import { User } from '../user/user.model';

const createToDB = async (payload: IBusiness, userId: mongoose.Types.ObjectId) => {
  // Check if business already exists for this user
  const exists = await Business.findOne({ owner: userId }, "_id").lean();
  if (exists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Business already exists for this user');
  }

  // Set location
  const { latitude, longitude } = await getLatLongWithLocalRequest(String(payload.address));
  payload.location = {
    type: "Point",
    coordinates: [longitude, latitude]
  };

  // Set owner
  payload.owner = userId;

  // Format images if present
  if (payload.images) {
    payload.images = payload.images.map((image: any) => ({
      imageUrl: typeof image === 'string' ? image : image.imageUrl,
      uploadedBy: userId,
      uploadedAt: new Date(),
    }));
  }

  console.log(payload)
  return await Business.create(payload);
};

const updateInDB = async (images: string[], userId: mongoose.Types.ObjectId, businessId: mongoose.Types.ObjectId) => {

  let formattedImages: any[] = [];
  if (images && images.length > 0) {
    formattedImages = images.map((image: any) => ({
      imageUrl: typeof image === 'string' ? image : image.imageUrl,
      uploadedBy: userId,
      uploadedAt: new Date(),
    }));
  }

  const updated = await Business.findByIdAndUpdate(
    businessId,
    { $push: { images: { $each: formattedImages } } },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Business not found');
  }
  return updated;
};

const deleteFromDB = async (userId: mongoose.Types.ObjectId) => {
  const deleted = await Business.findOneAndDelete({ owner: userId });
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Business not found');
  }
  return deleted;
};

const getAllFromDB = async (query: Record<string, any>) => {

  // const { lat, lng, km } = query;

  const lat = Number(query.lat)
  const lng = Number(query.lng)
  const km = Number(query.km)

  if (lat && lng) {
    const radiusInMeters = (km || 10) * 1000; // default 10 km

    query.location = {
      $geoWithin: {
        $centerSphere: [
          [lng, lat],
          radiusInMeters / 6378.1, // radius in radians
        ],
      },
    };
  }

  const qb = new QueryBuilder(Business.find(), query)
    .paginate()
    .search(['name', 'location'])
    .fields()
    .filter()
    .sort();
  const initialData = await qb.modelQuery.lean();
  const pagination = await qb.getPaginationInfo();
  console.log(initialData)

  const data = Array.isArray(initialData) ? await Promise.all(
    initialData.map(async (item) => {
      const user = await User.findById(item.owner, 'restaurant_crowd_status').lean().exec();
      const { owner, ...rest } = item as any;
      return {
        ...rest,
        images: undefined,
        coverPhoto: (item?.images as any)?.[0] ?? 'normal',
        crowdStatus: user?.restaurant_crowd_status ?? 'normal',
      };
    })
  ) : [];
  return {
    pagination,
    data
  };
}

const getByIdFromDB = async (userId: mongoose.Types.ObjectId, businessId: mongoose.Types.ObjectId) => {
  const business = await Business.findById(businessId, '-location -isApproved -owner')
    .populate([
      {
        path: 'images.uploadedBy',
        select: 'name profileImage',
        options: { strictPopulate: false },
      }
    ]).lean().exec() as IBusiness;

  const gallery = business?.images?.filter(({ uploadedBy }) => uploadedBy?._id?.toString() === userId.toString()) || [];
  const usersPictures = business?.images?.filter(({ uploadedBy }) => uploadedBy?._id?.toString() !== userId.toString()) || [];

  (business as any).gallery = gallery;
  (business as any).usersPictures = usersPictures;
  delete (business as any).images;
  return business;
};

const myBussIness = async (userId: mongoose.Types.ObjectId) => {
  const business = await Business.findOne({ owner: userId }, '-location -isApproved -owner')
    .populate([
      {
        path: 'images.uploadedBy',
        select: 'name profileImage',
        options: { strictPopulate: false },
      }
    ]).lean().exec() as IBusiness | null;

  if (!business) {
    throw new ApiError(404, 'Business not found');
  }

  const gallery = business.images?.filter(({ uploadedBy }) => uploadedBy?._id?.toString() === userId.toString()) || [];
  const usersPictures = business.images?.filter(({ uploadedBy }) => uploadedBy?._id?.toString() !== userId.toString()) || [];

  (business as any).gallery = gallery;
  (business as any).usersPictures = usersPictures;
  delete (business as any).images;
  return business;
};



const getBusinessByIdFromDB = async (userId: mongoose.Types.ObjectId, businessId: mongoose.Types.ObjectId) => {
  const business = await Business.findById(businessId, '-location -isApproved')
    .populate([
      {
        path: 'owner',
        select: 'name email profileImage',
      },
      {
        path: 'images.uploadedBy',
        select: 'name profileImage',
      }
    ]).lean().exec() as IBusiness;


  const promoCode = await Promo.findOne({ user: userId }, '-generateQrCode -generatePromocode -user').lean().exec() as IPromo | null;

  (business as any).promoCode = promoCode;
  if (
    promoCode &&
    promoCode.startDate &&
    promoCode.endDate &&
    promoCode.active &&
    new Date() >= promoCode.startDate &&
    new Date() <= promoCode.endDate
  ) {
    (business as any).isPromoActive = true;
  } else {
    (business as any).isPromoActive = false;
  }

  return business;
};
export const BusinessService = {
  createToDB,
  updateInDB,
  deleteFromDB,
  getAllFromDB,
  getByIdFromDB,
  getBusinessByIdFromDB,
  myBussIness
};


