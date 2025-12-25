import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { IContact } from './contact.interface';
import { Contact } from './contact.model';

const createToDB = async (payload: IContact) => {
  const created = await Contact.create(payload);
  return created;
};

const updateInDB = async (id: string, payload: Partial<IContact>) => {
  const updated = await Contact.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact not found');
  }
  return updated;
};

const deleteFromDB = async (id: string) => {
  const deleted = await Contact.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact not found');
  }
  return deleted;
};

const getAllFromDB = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(Contact.find(), query)
    .paginate()
    .search(['name', 'email', 'subject', 'message'])
    .fields()
    .filter()
    .sort();
  const data = await qb.modelQuery.lean();
  const pagination = await qb.getPaginationInfo();
  return { pagination, data };
};

const getByIdFromDB = async (id: string) => {
  const doc = await Contact.findById(id);
  if (!doc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact not found');
  }
  return doc;
};

export const ContactService = {
  createToDB,
  updateInDB,
  deleteFromDB,
  getAllFromDB,
  getByIdFromDB,
};


