import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  billingPlans,
  coupons,
  subscriptions,
  BillingPlan,
  InsertBillingPlan,
  Coupon,
  InsertCoupon,
  Subscription,
  InsertSubscription,
} from "../drizzle/schema";

/**
 * Billing Database Operations
 * All CRUD operations for plans, coupons, and subscriptions
 */

// ==================== BILLING PLANS ====================

export async function getAllPlans(): Promise<BillingPlan[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(billingPlans).orderBy(billingPlans.sortOrder);
}

export async function getActivePlans(): Promise<BillingPlan[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(billingPlans)
    .where(eq(billingPlans.active, 1))
    .orderBy(billingPlans.sortOrder);
}

export async function getPlanById(id: number): Promise<BillingPlan | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(billingPlans).where(eq(billingPlans.id, id)).limit(1);
  return result[0];
}

export async function createPlan(plan: InsertBillingPlan): Promise<BillingPlan> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(billingPlans).values(plan);
  const insertedId = Number(result[0].insertId);

  const newPlan = await getPlanById(insertedId);
  if (!newPlan) throw new Error("Failed to retrieve created plan");

  return newPlan;
}

export async function updatePlan(id: number, updates: Partial<InsertBillingPlan>): Promise<BillingPlan> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(billingPlans).set(updates).where(eq(billingPlans.id, id));

  const updated = await getPlanById(id);
  if (!updated) throw new Error("Plan not found after update");

  return updated;
}

export async function deletePlan(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Soft delete by setting active = 0
  await db.update(billingPlans).set({ active: 0 }).where(eq(billingPlans.id, id));
  return true;
}

// ==================== COUPONS ====================

export async function getAllCoupons(): Promise<Coupon[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

export async function getActiveCoupons(): Promise<Coupon[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(coupons)
    .where(eq(coupons.active, 1))
    .orderBy(desc(coupons.createdAt));
}

export async function getCouponById(id: number): Promise<Coupon | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  return result[0];
}

export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  return result[0];
}

export async function createCoupon(coupon: InsertCoupon): Promise<Coupon> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(coupons).values(coupon);
  const insertedId = Number(result[0].insertId);

  const newCoupon = await getCouponById(insertedId);
  if (!newCoupon) throw new Error("Failed to retrieve created coupon");

  return newCoupon;
}

export async function updateCoupon(id: number, updates: Partial<InsertCoupon>): Promise<Coupon> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(coupons).set(updates).where(eq(coupons.id, id));

  const updated = await getCouponById(id);
  if (!updated) throw new Error("Coupon not found after update");

  return updated;
}

export async function deleteCoupon(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Soft delete by setting active = 0
  await db.update(coupons).set({ active: 0 }).where(eq(coupons.id, id));
  return true;
}

export async function incrementCouponUsage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const coupon = await getCouponById(id);
  if (!coupon) throw new Error("Coupon not found");

  await db
    .update(coupons)
    .set({ usedCount: (coupon.usedCount || 0) + 1 })
    .where(eq(coupons.id, id));
}

export async function validateCoupon(code: string): Promise<{
  valid: boolean;
  coupon?: Coupon;
  error?: string;
}> {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, error: "Coupon not found" };
  }

  if (!coupon.active) {
    return { valid: false, error: "Coupon is inactive" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }

  if (coupon.maxUses && (coupon.usedCount || 0) >= coupon.maxUses) {
    return { valid: false, error: "Coupon usage limit reached" };
  }

  return { valid: true, coupon };
}

// ==================== SUBSCRIPTIONS ====================

export async function getUserSubscription(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  return result[0];
}

export async function getActiveSubscription(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  const subscription = result[0];

  // Check if subscription is still active
  if (subscription && subscription.status === "active") {
    if (new Date(subscription.currentPeriodEnd) > new Date()) {
      return subscription;
    }
  }

  return undefined;
}

export async function createSubscription(subscription: InsertSubscription): Promise<Subscription> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(subscription);
  const insertedId = Number(result[0].insertId);

  const newSubscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, insertedId))
    .limit(1);

  if (!newSubscription[0]) throw new Error("Failed to retrieve created subscription");

  return newSubscription[0];
}

export async function updateSubscription(
  id: number,
  updates: Partial<InsertSubscription>
): Promise<Subscription> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(updates).where(eq(subscriptions.id, id));

  const updated = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);

  if (!updated[0]) throw new Error("Subscription not found after update");

  return updated[0];
}

export async function cancelSubscription(userId: number, immediate: boolean = false): Promise<Subscription> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) throw new Error("No subscription found");

  if (immediate) {
    return await updateSubscription(subscription.id, {
      status: "cancelled",
      currentPeriodEnd: new Date(),
    });
  } else {
    return await updateSubscription(subscription.id, {
      cancelAtPeriodEnd: 1,
    });
  }
}
