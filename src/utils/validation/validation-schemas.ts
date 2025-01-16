import { z } from "zod";

export enum ValidationMessages {
  REQUIRED = 'This field is required'
}

const addressSchema = z.object({
  street: z.string().trim().min(1, ValidationMessages.REQUIRED),
  city: z.string().trim().min(1, ValidationMessages.REQUIRED),
  zipcode: z.string().optional()
});

const companySchema = z.object({
  name: z.string().optional()
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, ValidationMessages.REQUIRED),
  username: z.string().trim().min(1, ValidationMessages.REQUIRED),
  email: z.string().trim().email(),
  address: addressSchema,
  company: companySchema,
  image_url: z.string().optional(),
})