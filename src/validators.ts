import { z } from 'zod';

const userSchema = z.object({
  body: z.object({
    username: z.string().min(3, {
      message: 'Username must be at least 3 characters long',
    }),
    password: z.string().min(5, {
      message: 'Password must be at least 5 characters long',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, {
        message: 'Username must be at least 3 characters long',
      })
      .optional(),
    password: z
      .string()
      .min(5, {
        message: 'Password must be at least 5 characters long',
      })
      .optional(),
    avatar: z.string().optional(),
    favouriteRestaurant: z.string().optional(),
  }),
});

export { userSchema, updateSchema };
