import { int, mysqlTable, text, timestamp, varchar, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * API Settings table - secure storage for integration credentials
 * Values are encrypted at rest (handled by application layer)
 */
export const apiSettings = mysqlTable("api_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Setting key (e.g., "whatsapp_phone_id", "google_client_id") */
  key: varchar("key", { length: 255 }).notNull().unique(),
  /** Encrypted value */
  value: text("value").notNull(),
  /** Setting category for organization */
  category: mysqlEnum("category", [
    "whatsapp",
    "google",
    "openrouter",
    "stripe",
    "lemon_squeezy",
    "baileys",
    "general"
  ]).notNull(),
  /** Human-readable description */
  description: text("description"),
  /** Whether this setting is required for the feature to work */
  required: int("required").default(0).notNull(), // 0 = false, 1 = true
  /** Last updated timestamp */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** User who last updated (openId) */
  updatedBy: varchar("updatedBy", { length: 64 }),
});

export type ApiSetting = typeof apiSettings.$inferSelect;
export type InsertApiSetting = typeof apiSettings.$inferInsert;
