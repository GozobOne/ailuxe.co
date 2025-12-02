import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllPlans,
  getActivePlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getUserSubscription,
  getActiveSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
} from "./billing-db";

/**
 * Billing tRPC Router
 * Full CRUD operations for plans, coupons, and subscriptions
 */

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const billingRouter = router({
  // ==================== BILLING PLANS ====================

  plans: router({
    /**
     * Get all plans (admin only)
     */
    getAll: adminProcedure.query(async () => {
      return await getAllPlans();
    }),

    /**
     * Get active plans (public)
     */
    getActive: protectedProcedure.query(async () => {
      return await getActivePlans();
    }),

    /**
     * Get plan by ID
     */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const plan = await getPlanById(input.id);
        if (!plan) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });
        }
        return plan;
      }),

    /**
     * Create plan (admin only)
     */
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          description: z.string().optional(),
          price: z.number().int().min(0),
          currency: z.string().default("USD"),
          interval: z.enum(["monthly", "yearly", "lifetime"]),
          features: z.string().optional(),
          interactionQuota: z.number().int().optional(),
          active: z.number().int().min(0).max(1).optional(),
          sortOrder: z.number().int().optional(),
          stripePriceId: z.string().optional(),
          lemonSqueezyVariantId: z.string().optional(),
          trialDurationDays: z.number().int().min(1).optional(),
          trialPrice: z.number().int().min(0).optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Validate trial fields
        if (input.trialDurationDays && input.trialPrice === undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Trial price is required when trial duration is set",
          });
        }
        if (input.trialPrice !== undefined && !input.trialDurationDays) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Trial duration is required when trial price is set",
          });
        }
        return await createPlan(input);
      }),

    /**
     * Update plan (admin only)
     */
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          price: z.number().int().min(0).optional(),
          currency: z.string().optional(),
          interval: z.enum(["monthly", "yearly", "lifetime"]).optional(),
          features: z.string().optional(),
          interactionQuota: z.number().int().optional(),
          active: z.number().int().min(0).max(1).optional(),
          sortOrder: z.number().int().optional(),
          stripePriceId: z.string().optional(),
          lemonSqueezyVariantId: z.string().optional(),
          trialDurationDays: z.number().int().min(1).optional().nullable(),
          trialPrice: z.number().int().min(0).optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        // Validate trial fields if both are being updated
        if (updates.trialDurationDays && updates.trialPrice === undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Trial price is required when trial duration is set",
          });
        }
        if (updates.trialPrice !== undefined && updates.trialPrice !== null && !updates.trialDurationDays) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Trial duration is required when trial price is set",
          });
        }
        return await updatePlan(id, updates);
      }),

    /**
     * Delete plan (admin only - soft delete)
     */
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deletePlan(input.id);
      }),
  }),

  // ==================== COUPONS ====================

  coupons: router({
    /**
     * Get all coupons (admin only)
     */
    getAll: adminProcedure.query(async () => {
      return await getAllCoupons();
    }),

    /**
     * Get active coupons (admin only)
     */
    getActive: adminProcedure.query(async () => {
      return await getActiveCoupons();
    }),

    /**
     * Get coupon by ID (admin only)
     */
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const coupon = await getCouponById(input.id);
        if (!coupon) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Coupon not found" });
        }
        return coupon;
      }),

    /**
     * Validate coupon code (public)
     */
    validate: protectedProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return await validateCoupon(input.code);
      }),

    /**
     * Create coupon (admin only)
     */
    create: adminProcedure
      .input(
        z.object({
          code: z.string().min(1).max(50).toUpperCase(),
          description: z.string().optional(),
          discountType: z.enum(["percentage", "fixed"]),
          discountValue: z.number().int().min(1),
          maxUses: z.number().int().optional(),
          expiresAt: z.date().optional(),
          active: z.number().int().min(0).max(1).optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if code already exists
        const existing = await getCouponByCode(input.code);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Coupon code already exists" });
        }
        return await createCoupon(input);
      }),

    /**
     * Update coupon (admin only)
     */
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          code: z.string().min(1).max(50).toUpperCase().optional(),
          description: z.string().optional(),
          discountType: z.enum(["percentage", "fixed"]).optional(),
          discountValue: z.number().int().min(1).optional(),
          maxUses: z.number().int().optional(),
          expiresAt: z.date().optional(),
          active: z.number().int().min(0).max(1).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await updateCoupon(id, updates);
      }),

    /**
     * Delete coupon (admin only - soft delete)
     */
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteCoupon(input.id);
      }),
  }),

  // ==================== SUBSCRIPTIONS ====================

  subscriptions: router({
    /**
     * Get current user's subscription
     */
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSubscription(ctx.user.id);
    }),

    /**
     * Get active subscription for current user
     */
    getActive: protectedProcedure.query(async ({ ctx }) => {
      return await getActiveSubscription(ctx.user.id);
    }),

    /**
     * Create subscription (admin can create for any user)
     */
    create: protectedProcedure
      .input(
        z.object({
          userId: z.number().optional(), // Admin can specify userId
          planId: z.number(),
          status: z.enum(["active", "cancelled", "expired", "trialing"]),
          currentPeriodStart: z.date(),
          currentPeriodEnd: z.date(),
          stripeSubscriptionId: z.string().optional(),
          lemonSqueezySubscriptionId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // If userId not provided, use current user
        const userId = input.userId || ctx.user.id;

        // Only admin can create subscription for other users
        if (userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Cannot create subscription for other users" });
        }

        return await createSubscription({
          ...input,
          userId,
        });
      }),

    /**
     * Update subscription (admin only)
     */
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["active", "cancelled", "expired", "trialing"]).optional(),
          currentPeriodStart: z.date().optional(),
          currentPeriodEnd: z.date().optional(),
          cancelAtPeriodEnd: z.number().int().min(0).max(1).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await updateSubscription(id, updates);
      }),

    /**
     * Cancel subscription
     */
    cancel: protectedProcedure
      .input(
        z.object({
          immediate: z.boolean().default(false),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await cancelSubscription(ctx.user.id, input.immediate);
      }),
  }),
});
