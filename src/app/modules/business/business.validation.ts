import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Business name is required' }),
    coverPhoto: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    userPics: z.array(z.object({
      imageUrl: z.string(),
      uploadedBy: z.string(),
    })).optional(),
    isApproved: z.boolean().optional(),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    coverPhoto: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    userPics: z.array(z.object({
      imageUrl: z.string(),
      uploadedBy: z.string(),
    })).optional(),
    isApproved: z.boolean().optional(),
  }),
});

export const BusinessValidation = {
  createZodSchema,
  updateZodSchema,
};
