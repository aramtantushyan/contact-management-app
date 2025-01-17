import { z } from "zod";

export enum ValidationMessages {
  REQUIRED = 'This field is required'
}

const addressSchema = z.object({
  street: z.string().trim().min(1, ValidationMessages.REQUIRED),
  city: z.string().trim().min(1, ValidationMessages.REQUIRED),
  zipcode: z.string().trim().optional()
});

const companySchema = z.object({
  name: z.string().trim().optional()
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, ValidationMessages.REQUIRED),
  username: z.string().trim().min(1, ValidationMessages.REQUIRED),
  email: z.string().trim().min(1, ValidationMessages.REQUIRED).email(),
  address: addressSchema,
  company: companySchema,
  image_url: z.string().trim().optional(),
})