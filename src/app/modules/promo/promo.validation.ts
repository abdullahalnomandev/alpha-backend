import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    discount: z.number({ required_error: 'Discount is required' }),
    startDate: z.coerce.date({ required_error: 'Start date is required' }),
    endDate: z.coerce.date({ required_error: 'End date is required' }),
    generatePromocode: z.boolean().default(false),
  }).refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    discount: z.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    generatePromocode: z.boolean().optional(),
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  }, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  }),
});

export const PromoValidation = {
  createZodSchema,
  updateZodSchema,
};


