import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BusinessService } from './business.service';
import { getMultipleFilesPath } from '../../../shared/getFilePath';
import mongoose from 'mongoose';

const create = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  let images = getMultipleFilesPath(req.files, 'image');

 const data = {
    images,
    ...req.body,
 }
 const result = await BusinessService.createToDB(data, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Business created successfully',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const businessId = (req.params as any)?.id 
  let images = getMultipleFilesPath(req.files, 'image');

  const safeImages = images ?? [];
  const result = await BusinessService.updateInDB(safeImages, userId, businessId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Business updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await BusinessService.deleteFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Business deleted successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await BusinessService.getAllFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Businesses retrieved successfully',
    pagination: result.pagination,
    data: result.data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const businessId= (req.params as any)?.id
  const result = await BusinessService.getByIdFromDB(userId,businessId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Business retrieved successfully',
    data: result,
  });
});

const myBusiness = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await BusinessService.myBussIness(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Business retrieved successfully',
    data: result,
  });
});

const getBusnessById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const businessId= (req.params as any)?.id
  const result = await BusinessService.getBusinessByIdFromDB(userId,businessId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Business retrieved successfully',
    data: result,
  });
});

export const BusinessController = { create, update, remove, getAll, getById,getBusnessById,myBusiness };
