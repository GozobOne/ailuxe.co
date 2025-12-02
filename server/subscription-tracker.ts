import { eq, and, lt, gte, sql } from "drizzle-orm";
import { getDb } from "./db";
import { subscriptions, billingPlans, users } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

/**
 * Subscription Tracking System
 * Handles trial-to-paid conversion, expiry tracking, and automated reminders
 */

export interface SubscriptionStatus {
  userId: number;
  status: "trial" | "active" | "expired" | "cancelled";
  planName: string;
  trialEndsAt: Date | null;
  expiresAt: Date | null;
  daysUntilExpiry: number | null;
}

/**
 * Get subscription status for a user
 */
export async function getSubscriptionStatus(userId: number): Promise<SubscriptionStatus | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select({
      userId: subscriptions.userId,
      status: subscriptions.status,
      planName: billingPlans.name,
      trialEndsAt: subscriptions.trialEndsAt,
      expiresAt: subscriptions.expiresAt,
    })
    .from(subscriptions)
    .leftJoin(billingPlans, eq(subscriptions.planId, billingPlans.id))
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (result.length === 0) return null;

  const sub = result[0];
  const now = new Date();
  
  let daysUntilExpiry: number | null = null;
  if (sub.trialEndsAt && sub.status === "trial") {
    daysUntilExpiry = Math.ceil((sub.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  } else if (sub.expiresAt && sub.status === "active") {
    daysUntilExpiry = Math.ceil((sub.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  return {
    userId: sub.userId,
    status: sub.status as "trial" | "active" | "expired" | "cancelled",
    planName: sub.planName || "Unknown Plan",
    trialEndsAt: sub.trialEndsAt,
    expiresAt: sub.expiresAt,
    daysUntilExpiry,
  };
}

/**
 * Get all active trial users
 */
export async function getActiveTrialUsers() {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  
  const result = await db
    .select({
      userId: subscriptions.userId,
      userName: users.name,
      userEmail: users.email,
      planName: billingPlans.name,
      trialEndsAt: subscriptions.trialEndsAt,
      createdAt: subscriptions.createdAt,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .leftJoin(billingPlans, eq(subscriptions.planId, billingPlans.id))
    .where(
      and(
        eq(subscriptions.status, "trial"),
        gte(subscriptions.trialEndsAt, now)
      )
    );

  return result.map(r => ({
    userId: r.userId,
    userName: r.userName || "Unknown User",
    userEmail: r.userEmail || "",
    planName: r.planName || "Unknown Plan",
    trialEndsAt: r.trialEndsAt!,
    daysRemaining: Math.ceil((r.trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    createdAt: r.createdAt,
  }));
}

/**
 * Get trials expiring soon (within 3 days)
 */
export async function getTrialsExpiringSoon() {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const result = await db
    .select({
      userId: subscriptions.userId,
      userName: users.name,
      userEmail: users.email,
      planName: billingPlans.name,
      trialEndsAt: subscriptions.trialEndsAt,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .leftJoin(billingPlans, eq(subscriptions.planId, billingPlans.id))
    .where(
      and(
        eq(subscriptions.status, "trial"),
        gte(subscriptions.trialEndsAt, now),
        lt(subscriptions.trialEndsAt, threeDaysFromNow)
      )
    );

  return result.map(r => ({
    userId: r.userId,
    userName: r.userName || "Unknown User",
    userEmail: r.userEmail || "",
    planName: r.planName || "Unknown Plan",
    trialEndsAt: r.trialEndsAt!,
    daysRemaining: Math.ceil((r.trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  }));
}

/**
 * Convert trial subscription to paid
 */
export async function convertTrialToPaid(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db
      .update(subscriptions)
      .set({
        status: "active",
        trialEndsAt: null,
        expiresAt: oneMonthFromNow,
        updatedAt: now,
      })
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "trial")
        )
      );

    // Notify owner of conversion
    await notifyOwner({
      title: "Trial Converted to Paid",
      content: `User ID ${userId} has successfully converted from trial to paid subscription.`,
    });

    return true;
  } catch (error) {
    console.error("[Subscription] Error converting trial to paid:", error);
    return false;
  }
}

/**
 * Expire trial subscriptions that have passed their trial end date
 */
export async function expireTrials(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const now = new Date();

    const result = await db
      .update(subscriptions)
      .set({
        status: "expired",
        updatedAt: now,
      })
      .where(
        and(
          eq(subscriptions.status, "trial"),
          lt(subscriptions.trialEndsAt, now)
        )
      );

    const expiredCount = result[0]?.affectedRows || 0;

    if (expiredCount > 0) {
      await notifyOwner({
        title: "Trials Expired",
        content: `${expiredCount} trial subscription(s) have expired and been marked as expired.`,
      });
    }

    return expiredCount;
  } catch (error) {
    console.error("[Subscription] Error expiring trials:", error);
    return 0;
  }
}

/**
 * Send trial reminder notifications (3 days before expiry)
 */
export async function sendTrialReminders(): Promise<number> {
  try {
    const expiringSoon = await getTrialsExpiringSoon();

    for (const trial of expiringSoon) {
      // Send notification to owner (in production, send email to user)
      await notifyOwner({
        title: `Trial Expiring Soon: ${trial.userName}`,
        content: `User ${trial.userName} (${trial.userEmail}) has ${trial.daysRemaining} days left on their ${trial.planName} trial. Trial ends on ${trial.trialEndsAt.toLocaleDateString()}.`,
      });
    }

    return expiringSoon.length;
  } catch (error) {
    console.error("[Subscription] Error sending trial reminders:", error);
    return 0;
  }
}

/**
 * Run subscription maintenance tasks
 * Should be called periodically (e.g., daily cron job)
 */
export async function runSubscriptionMaintenance() {
  console.log("[Subscription] Running maintenance tasks...");

  const expiredCount = await expireTrials();
  console.log(`[Subscription] Expired ${expiredCount} trial(s)`);

  const reminderCount = await sendTrialReminders();
  console.log(`[Subscription] Sent ${reminderCount} trial reminder(s)`);

  return {
    expiredCount,
    reminderCount,
    timestamp: new Date(),
  };
}

// Auto-run maintenance every 24 hours
setInterval(
  () => {
    runSubscriptionMaintenance().catch(console.error);
  },
  24 * 60 * 60 * 1000
); // 24 hours

// Run once on startup
setTimeout(() => {
  runSubscriptionMaintenance().catch(console.error);
}, 5000); // 5 seconds after startup
