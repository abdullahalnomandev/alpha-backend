import { z } from 'zod';

// The body will come from Postman, so we validate the body under "body"
const createZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Business name is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
    url: z.string({ required_error: 'Business URL is required' }),
    status: z.enum(['pending', 'approved', 'rejected']).optional()
  })
});

const updateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    url: z.string().optional(),
    user: z.string().optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional()
  })
});

export const BusinessRequestValidation = {
  createZodSchema,
  updateZodSchema,
};
