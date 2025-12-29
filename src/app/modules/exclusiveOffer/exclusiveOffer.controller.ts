import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ExclusiveOfferService } from './exclusiveOffer.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

const create = catchAsync(async (req: Request, res: Response) => {
  const image = getSingleFilePath(req.files, 'image');
  const data = {
    ...req.body,
    ...(image && { image }),
  };

  const result = await ExclusiveOfferService.createToDB(data);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Exclusive offer created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ExclusiveOfferService.getAllFromDB(req.query);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Exclusive offers retrieved successfully',
    pagination: result.pagination,
    data: result.data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await ExclusiveOfferService.getByIdFromDB(req.params?.id as string);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Exclusive offer retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id;
  const image = getSingleFilePath(req.files, 'image');
  
  const data = {
    ...req.body,
    ...(image && { image }),
  };
  
  const result = await ExclusiveOfferService.updateInDB(id, data);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Exclusive offer updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await ExclusiveOfferService.deleteFromDB(req.params?.id);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Exclusive offer deleted successfully',
    data: result,
  });
});

export const ExclusiveOfferController = {
  create,
  getAll,
  getById,
  update,
  remove,
};

