import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { IExclusiveOffer } from './exclusiveOffer.interface';
import { ExclusiveOffer } from './exclusiveOffer.model';
import { getLatLongWithLocalRequest } from './exclusiveOffer.util';
import { FavouriteExclusiveOffer } from './favourite/favouriteExclusiveOffer.model';

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

const getAllFromDB = async (query: Record<string, any>,userId:string) => {
  const { lat, lng, maxKm, minKm, category } = query;

  let data: any[] = [];
  let pagination = {};

  if (lat && lng) {
    // Build geoNear base
    const geoNearQuery: any = {
      near: {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)],
      },
      distanceField: 'distance',
      spherical: true,
      ...(maxKm ? { maxDistance: Number(maxKm) * 1000 } : {}),
      ...(minKm ? { minDistance: Number(minKm) * 1000 } : {}),
    };

    const aggregationStages: any[] = [{ $geoNear: geoNearQuery }];

    aggregationStages.push(
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          distance: 1,
          image: 1,
          name: 1,
          discount: 1,
          title: 1,
          category: {
            _id: 1,
            name: 1,
          },
          location: 1,
        },
      }
    );

    // Pagination settings
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total after geoNear (no match by category)
    const countAggregation = [...aggregationStages, { $count: 'total' }];
    const totalResult = await ExclusiveOffer.aggregate(countAggregation).exec();
    const total = totalResult[0]?.total || 0;

    // Results with pagination
    data = await ExclusiveOffer.aggregate([
      ...aggregationStages,
      { $skip: skip },
      { $limit: limit },
    ]).exec();

    pagination = {
      total,
      limit,
      page,
      totalPage: Math.ceil(total / limit),
    };
  }
 else {
    let modelQuery = ExclusiveOffer.find().select('name title image discount') as any;

    const qb = new QueryBuilder(modelQuery, { ...query })
      .paginate()
      .search(['name', 'title'])
      .filter(['lat', 'lng', 'km', 'minKm'])
      .sort();

    data = await qb.modelQuery.populate('category', 'name');
    pagination = await qb.getPaginationInfo();
  }

  return { pagination, data };
};
// const getAllFromDB = async (query: Record<string, any>) => {
//   const { lat, lng, maxKm, minKm, category } = query;

//   let data: any[] = [];
//   let pagination = {};

//   if (lat && lng) {
//     // Build geoNear base
//     const geoNearQuery: any = {
//       near: {
//         type: 'Point',
//         coordinates: [Number(lng), Number(lat)],
//       },
//       distanceField: 'distance',
//       spherical: true,
//       ...(maxKm ? { maxDistance: Number(maxKm) * 1000 } : {}),
//       ...(minKm ? { minDistance: Number(minKm) * 1000 } : {}),
//     };

//     const aggregationStages: any[] = [{ $geoNear: geoNearQuery }];

//     aggregationStages.push(
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category',
//           foreignField: '_id',
//           as: 'category',
//         },
//       },
//       {
//         $unwind: {
//           path: '$category',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           distance: 1,
//           image: 1,
//           name: 1,
//           discount: 1,
//           title: 1,
//           category: {
//             _id: 1,
//             name: 1,
//           },
//           location: 1,
//         },
//       }
//     );

//     // Pagination settings
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Count total after geoNear (no match by category)
//     const countAggregation = [...aggregationStages, { $count: 'total' }];
//     const totalResult = await ExclusiveOffer.aggregate(countAggregation).exec();
//     const total = totalResult[0]?.total || 0;

//     // Results with pagination
//     data = await ExclusiveOffer.aggregate([
//       ...aggregationStages,
//       { $skip: skip },
//       { $limit: limit },
//     ]).exec();

//     pagination = {
//       total,
//       limit,
//       page,
//       totalPage: Math.ceil(total / limit),
//     };
//   }
//  else {
//     let modelQuery = ExclusiveOffer.find().select('name title image discount') as any;

//     const qb = new QueryBuilder(modelQuery, { ...query })
//       .paginate()
//       .search(['name', 'title'])
//       .filter(['lat', 'lng', 'km', 'minKm'])
//       .sort();

//     data = await qb.modelQuery.populate('category', 'name');
//     pagination = await qb.getPaginationInfo();
//   }

//   return { pagination, data };
// };


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

const createFavourite = async ({
  user,
  exclusiveOffer,
}: {
  user: string;
  exclusiveOffer: string;
}) => {
  // Check if Exclusive Offer exists
  const exclusiveOfferExists = await ExclusiveOffer.findById(exclusiveOffer).lean();
  if (!exclusiveOfferExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exclusive offer not found');
  }

  // Check if it's already a favourite for the user (toggle: if so, remove. if not, add)
  const existingFavourite = await FavouriteExclusiveOffer.findOne({
    user,
    exclusiveOffer,
  });

  if (existingFavourite) {
    await FavouriteExclusiveOffer.findByIdAndDelete(existingFavourite._id);
    return { removed: true };
  } else {
    const newFavourite = await FavouriteExclusiveOffer.create({
      user,
      exclusiveOffer,
    });
    return { added: true, favourite: newFavourite };
  }
};

const getFavouritesFromDB = async (userId: string, query: Record<string, any>) => {
  const qb = new QueryBuilder(FavouriteExclusiveOffer.find({ user: userId })
      .populate({
        path: 'exclusiveOffer',
        populate: {
          path: 'category',
          select: 'name',
        },
        select: 'name title image description location address discount category',
      }),query)
    .paginate()
    .fields()
    .filter()
    .sort();
  
  const data = await qb.modelQuery.lean();
  const pagination = await qb.getPaginationInfo();
  
  return {
    pagination,
    data,
  };
};

export const ExclusiveOfferService = {
  createToDB,
  getAllFromDB,
  getByIdFromDB,
  updateInDB,
  deleteFromDB,
  createFavourite,
  getFavouritesFromDB,
};
