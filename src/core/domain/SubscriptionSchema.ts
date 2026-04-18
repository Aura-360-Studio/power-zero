import { z } from 'zod';

export const CategoryEnum = z.enum([
  'ENTERTAINMENT',
  'MUSIC',
  'TOOLS',
  'LEARNING',
  'WELLNESS',
  'UTILITY'
]);

export const CycleEnum = z.enum([
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY'
]);

export const StatusEnum = z.enum([
  'ACTIVE',
  'CANCELLED',
  'PAUSED'
]);

export const SubscriptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive("Amount must be a positive number"),
  category: CategoryEnum,
  cycle: CycleEnum,
  nextBillingDate: z.string().datetime({ message: "Invalid ISO 8601 date string" }),
  status: StatusEnum
});

export type ValidatedSubscription = z.infer<typeof SubscriptionSchema>;
