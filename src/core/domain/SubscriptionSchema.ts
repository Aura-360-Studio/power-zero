import { z } from 'zod';

export const CategoryEnum = z.enum([
  'UTILITIES',
  'ENTERTAINMENT',
  'WORK',
  'HEALTH',
  'SHOPPING',
  'TRAVEL',
  'FINANCE',
  'CUSTOM'
]);

export const CycleTypeEnum = z.enum([
  'CALENDAR_MONTH',
  'CALENDAR_YEAR',
  'DAYS',
  'WEEKS'
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
  cycleType: CycleTypeEnum,
  cycleValue: z.number().int().positive("Interval value must be a positive integer"),
  startDate: z.string().datetime({ message: "Invalid ISO 8601 start date" }),
  nextBillingDate: z.string().datetime({ message: "Invalid ISO 8601 next billing date" }),
  status: StatusEnum,
  isArchived: z.boolean().default(false),
  cancelledAt: z.string().datetime({ message: "Invalid ISO 8601 cancellation date" }).optional(),
  cycle: CycleEnum.optional()
});

export type ValidatedSubscription = z.infer<typeof SubscriptionSchema>;
