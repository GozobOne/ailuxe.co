import { eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  whiteLabelSettings,
  WhiteLabelSetting,
  InsertWhiteLabelSetting,
} from "../drizzle/schema";

/**
 * White-Label Settings Database Operations
 * Per-tenant customization settings
 */

export async function getWhiteLabelSettings(userId: number): Promise<WhiteLabelSetting | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(whiteLabelSettings)
    .where(eq(whiteLabelSettings.userId, userId))
    .limit(1);

  return result[0];
}

export async function createWhiteLabelSettings(
  settings: InsertWhiteLabelSetting
): Promise<WhiteLabelSetting> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(whiteLabelSettings).values(settings);
  const insertedId = Number(result[0].insertId);

  const newSettings = await db
    .select()
    .from(whiteLabelSettings)
    .where(eq(whiteLabelSettings.id, insertedId))
    .limit(1);

  if (!newSettings[0]) throw new Error("Failed to retrieve created settings");

  return newSettings[0];
}

export async function updateWhiteLabelSettings(
  userId: number,
  updates: Partial<InsertWhiteLabelSetting>
): Promise<WhiteLabelSetting> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if settings exist
  const existing = await getWhiteLabelSettings(userId);

  if (!existing) {
    // Create new settings
    return await createWhiteLabelSettings({
      userId,
      ...updates,
    });
  }

  // Update existing settings
  await db
    .update(whiteLabelSettings)
    .set(updates)
    .where(eq(whiteLabelSettings.userId, userId));

  const updated = await getWhiteLabelSettings(userId);
  if (!updated) throw new Error("Settings not found after update");

  return updated;
}

export async function getOrCreateWhiteLabelSettings(userId: number): Promise<WhiteLabelSetting> {
  const existing = await getWhiteLabelSettings(userId);

  if (existing) {
    return existing;
  }

  // Create default settings
  return await createWhiteLabelSettings({
    userId,
    currency: "USD",
    currencySymbol: "$",
    language: "en",
    locale: "en-US",
    rtl: 0,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    timezone: "UTC",
    taxRate: 0,
  });
}
