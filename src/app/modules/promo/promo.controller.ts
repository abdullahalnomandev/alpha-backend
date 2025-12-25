import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PromoService } from './promo.service';

const create = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const result = await PromoService.createToDB(req.body,userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Promo created successfully',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const result = await PromoService.updateInDB(req.body,userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Promo updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id

  const result = await PromoService.deleteFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Promo deleted successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await PromoService.getAllFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Promos retrieved successfully',
    pagination: result.pagination,
    data: result.data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {

  const userId = req.user?.id

  const result = await PromoService.getByIdFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Promo retrieved successfully',
    data: result,
  });
});

export const PromoController = { create, update, remove, getAll, getById };


