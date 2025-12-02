import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

/**
 * Phase 1 Migration Script
 * Creates billing_plans, coupons, subscriptions, and white_label_settings tables
 */

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

async function migrate() {
  console.log("[Migration] Connecting to database...");
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log("[Migration] Creating billing_plans table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS billing_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'USD',
        \`interval\` ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
        features TEXT,
        interactionQuota INT DEFAULT 500,
        active INT NOT NULL DEFAULT 1,
        sortOrder INT DEFAULT 0,
        stripePriceId VARCHAR(255),
        lemonSqueezyVariantId VARCHAR(255),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("[Migration] Creating coupons table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        discountType ENUM('percentage', 'fixed') NOT NULL,
        discountValue INT NOT NULL,
        maxUses INT,
        usedCount INT DEFAULT 0,
        expiresAt TIMESTAMP NULL,
        active INT NOT NULL DEFAULT 1,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("[Migration] Creating subscriptions table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        planId INT NOT NULL,
        status ENUM('active', 'cancelled', 'expired', 'trialing') NOT NULL,
        currentPeriodStart TIMESTAMP NOT NULL,
        currentPeriodEnd TIMESTAMP NOT NULL,
        cancelAtPeriodEnd INT DEFAULT 0,
        stripeSubscriptionId VARCHAR(255),
        lemonSqueezySubscriptionId VARCHAR(255),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_userId (userId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("[Migration] Creating white_label_settings table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS white_label_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        brandName VARCHAR(255),
        brandLogo TEXT,
        brandColor VARCHAR(20),
        currency VARCHAR(10) DEFAULT 'USD',
        currencySymbol VARCHAR(10) DEFAULT '$',
        language VARCHAR(10) DEFAULT 'en',
        locale VARCHAR(20) DEFAULT 'en-US',
        rtl INT DEFAULT 0,
        voiceModel VARCHAR(100),
        voiceLanguage VARCHAR(10),
        dateFormat VARCHAR(50) DEFAULT 'MM/DD/YYYY',
        timeFormat VARCHAR(50) DEFAULT '12h',
        timezone VARCHAR(100) DEFAULT 'UTC',
        taxRate INT DEFAULT 0,
        taxLabel VARCHAR(100),
        contractTemplate TEXT,
        termsUrl TEXT,
        privacyUrl TEXT,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_userId (userId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("[Migration] ✅ All tables created successfully!");
    console.log("[Migration] Phase 1 migration complete.");
    
  } catch (error) {
    console.error("[Migration] ❌ Error:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate()
  .then(() => {
    console.log("[Migration] Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[Migration] Failed:", error);
    process.exit(1);
  });
