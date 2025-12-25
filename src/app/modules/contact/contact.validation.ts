import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
    subject: z.string({ required_error: 'Subject is required' }),
    message: z.string({ required_error: 'Message is required' }),
    resolved: z.boolean().optional(),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    resolved: z.boolean().optional(),
  }),
});

export const ContactValidation = {
  createZodSchema,
  updateZodSchema,
};


