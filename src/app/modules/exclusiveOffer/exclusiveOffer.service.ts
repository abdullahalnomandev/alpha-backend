import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { IExclusiveOffer } from './exclusiveOffer.interface';
import { ExclusiveOffer } from './exclusiveOffer.model';
import { getLatLongWithLocalRequest } from './exclusiveOffer.util';

const createToDB = async (payload: IExclusiveOffer) => {
  const { latitude, longitude } = await getLatLongWithLocalRequest(
    String(payload.address)
  );
  payload.location = {
    type: 'Point',
    coordinates: [longitude, latitude], // [lng, lat]
  };
  return await ExclusiveOffer.create(payload);
};

const getAllFromDB = async (query: Record<string, any>) => {
  const { lat, lng, km, minKm } = query;

  let data: any[] = [];
  let pagination = {};

  if (lat && lng) {
    // Use aggregation for geo queries
    const geoNearQuery: any = {
      near: {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)],
      },
      distanceField: 'distance',
      spherical: true,
      ...(km ? { maxDistance: Number(km) * 1000 } : {}),
      ...(minKm ? { minDistance: Number(minKm) * 1000 } : {}),
    };

    const aggregation = ExclusiveOffer.aggregate([
      { $geoNear: geoNearQuery },
      {
        $project: {
          distance: 1,
          name: 1,
          title: 1,
          category: 1,
          location: 1,
        },
      },
    ]);

    // Apply pagination manually for aggregation
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ExclusiveOffer.countDocuments(); // optional: filter by geo? more complex
    data = await aggregation.skip(skip).limit(limit).exec();
    pagination = {
      total,
      limit,
      page,
      totalPage: Math.ceil(total / limit),
    };
  } else {
    // Use QueryBuilder only for regular query
    let modelQuery = ExclusiveOffer.find() as any;

    const qb = new QueryBuilder(modelQuery, { ...query })
      .paginate()
      .search(['name', 'title'])
      .filter(['lat', 'lng', 'km', 'minKm'])
      .sort();

    data = await qb.modelQuery;
    pagination = await qb.getPaginationInfo();
  }

  return { pagination, data };
};

const getByIdFromDB = async (id: string) => {
  const exclusiveOffer = await ExclusiveOffer.findById(id)
    .populate('category', 'name')
    .lean();

  if (!exclusiveOffer) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exclusive offer not found');
  }
  return exclusiveOffer;
};

const updateInDB = async (id: string, payload: Partial<IExclusiveOffer>) => {
  const updated = await ExclusiveOffer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('category', 'name')
    .lean();

  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exclusive offer not found');
  }
  return updated;
};

const deleteFromDB = async (id: string) => {
  const exclusiveOffer = await ExclusiveOffer.findById(id).lean();
  if (!exclusiveOffer) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exclusive offer not found');
  }
  const deleted = await ExclusiveOffer.findByIdAndDelete(id).lean();
  return deleted;
};

export const ExclusiveOfferService = {
  createToDB,
  getAllFromDB,
  getByIdFromDB,
  updateInDB,
  deleteFromDB,
};
