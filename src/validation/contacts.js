import Joi from 'joi';

export const postContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.number().required(),
  email: Joi.string().min(3).max(20).email().optional(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .min(3)
    .max(20)
    .default('personal')
    .optional(),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number(),
  email: Joi.string().min(3).max(20).email().optional(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .min(3)
    .max(20)
    .default('personal')
    .optional(),
});
