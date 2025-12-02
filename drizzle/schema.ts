import { pgTable, serial, varchar, text, integer, timestamp, index, pgEnum, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// Enums
export const intervalEnum = pgEnum('interval', ['monthly', 'yearly', 'lifetime']);
export const fileTypeEnum = pgEnum('file_type', ['txt', 'json', 'pdf']);
export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);
export const platformEnum = pgEnum('platform', ['whatsapp', 'telegram', 'signal', 'multiple']);
export const contactStatusEnum = pgEnum('contact_status', ['active', 'past', 'prospect', 'lead']);
export const directionEnum = pgEnum('direction', ['inbound', 'outbound']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'voice', 'image', 'document']);
export const modelCategoryEnum = pgEnum('model_category', ['arabic_female', 'european_female', 'male', 'kids']);
export const availabilityEnum = pgEnum('availability', ['available', 'booked_today', 'available_this_week', 'unavailable']);
export const oauthProviderEnum = pgEnum('oauth_provider', ['google', 'instagram', 'facebook']);
export const revenueTypeEnum = pgEnum('revenue_type', ['subscription', 'commission', 'booking']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'expired', 'trialing']);
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'agency', 'client']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const contractTypeEnum = pgEnum('contract_type', ['service', 'nda', 'non-compete']);
export const contractLanguageEnum = pgEnum('contract_language', ['en', 'ar']);
export const contractStatusEnum = pgEnum('contract_status', ['draft', 'sent', 'signed', 'paid', 'expired']);
export const apiCategoryEnum = pgEnum('api_category', ['whatsapp', 'google', 'openrouter', 'stripe', 'lemon_squeezy', 'baileys', 'general']);

export const billingPlans = pgTable("billing_plans", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	price: integer("price").notNull(),
	currency: varchar("currency", { length: 10 }).default('USD').notNull(),
	interval: intervalEnum("interval").notNull(),
	features: text("features"),
	interactionQuota: integer("interactionQuota").default(500),
	active: boolean("active").default(true).notNull(),
	sortOrder: integer("sortOrder").default(0),
	stripePriceId: varchar("stripePriceId", { length: 255 }),
	lemonSqueezyVariantId: varchar("lemonSqueezyVariantId", { length: 255 }),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
	trialDurationDays: integer("trialDurationDays"),
	trialPrice: integer("trialPrice"),
});

export const chatHistories = pgTable("chatHistories", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	fileName: varchar("fileName", { length: 255 }),
	fileType: fileTypeEnum("fileType"),
	fileUrl: text("fileUrl"),
	fileKey: text("fileKey"),
	messageCount: integer("messageCount"),
	processedAt: timestamp("processedAt"),
	personaModelId: varchar("personaModelId", { length: 255 }),
	toneConfig: text("toneConfig"),
	voiceCloneUrl: text("voiceCloneUrl"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
	id: serial("id").primaryKey(),
	code: varchar("code", { length: 50 }).notNull(),
	description: text("description"),
	discountType: discountTypeEnum("discountType").notNull(),
	discountValue: integer("discountValue").notNull(),
	maxUses: integer("maxUses"),
	usedCount: integer("usedCount").default(0),
	expiresAt: timestamp("expiresAt"),
	active: boolean("active").default(true).notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
},
(table) => ({
	codeIdx: index("code_idx").on(table.code),
}));

export const contacts = pgTable("contacts", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	title: varchar("title", { length: 100 }), // CEO, CTO, Manager, etc.
	phone: varchar("phone", { length: 50 }),
	phones: text("phones"), // JSON array of additional phone numbers
	email: varchar("email", { length: 320 }),
	emails: text("emails"), // JSON array of additional emails
	website: varchar("website", { length: 500 }),
	platform: platformEnum("platform"),
	status: contactStatusEnum("status").default('prospect').notNull(),
	tags: text("tags"),
	notes: text("notes"),
	avatarUrl: text("avatarUrl"),
	lastContactedAt: timestamp("lastContactedAt"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
},
(table) => ({
	userIdIdx: index("idx_userId").on(table.userId),
	statusIdx: index("idx_status").on(table.status),
}));

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

export const messages = pgTable("messages", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	contactId: integer("contactId"),
	platform: platformEnum("platform").notNull(),
	direction: directionEnum("direction").notNull(),
	messageType: messageTypeEnum("messageType").default('text'),
	content: text("content"),
	mediaUrl: text("mediaUrl"),
	transcription: text("transcription"),
	respondedBy: varchar("respondedBy", { length: 255 }),
	responseTime: integer("responseTime"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
},
(table) => ({
	userIdIdx: index("idx_userId_msg").on(table.userId),
	contactIdIdx: index("idx_contactId_msg").on(table.contactId),
	platformIdx: index("idx_platform_msg").on(table.platform),
}));

export const models = pgTable("models", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	category: modelCategoryEnum("category").notNull(),
	experience: integer("experience").default(0),
	location: varchar("location", { length: 255 }),
	dailyRate: integer("dailyRate").notNull(),
	rating: integer("rating").default(0),
	specialties: text("specialties"),
	languages: text("languages"),
	bookingCount: integer("bookingCount").default(0),
	phone: varchar("phone", { length: 50 }),
	email: varchar("email", { length: 320 }),
	photoUrl: text("photoUrl"),
	portfolioUrl: text("portfolioUrl"),
	availability: availabilityEnum("availability").default('available'),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const oauthTokens = pgTable("oauth_tokens", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	provider: oauthProviderEnum("provider").notNull(),
	accessToken: text("accessToken").notNull(),
	refreshToken: text("refreshToken"),
	expiresAt: timestamp("expiresAt"),
	scope: text("scope"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
},
(table) => ({
	userProviderIdx: index("idx_user_provider").on(table.userId, table.provider),
}));

export const revenue = pgTable("revenue", {
	id: serial("id").primaryKey(),
	agencyId: integer("agencyId").notNull(),
	clientId: integer("clientId").notNull(),
	bookingId: integer("bookingId"),
	contactId: integer("contactId"),
	revenueType: revenueTypeEnum("revenueType").notNull(),
	amount: integer("amount").notNull(),
	currency: varchar("currency", { length: 3 }).default('USD'),
	month: varchar("month", { length: 7 }).notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
},
(table) => ({
	agencyIdIdx: index("idx_agencyId").on(table.agencyId),
	clientIdIdx: index("idx_clientId").on(table.clientId),
	contactIdIdx: index("idx_contactId_rev").on(table.contactId),
}));

export type Revenue = typeof revenue.$inferSelect;
export type InsertRevenue = typeof revenue.$inferInsert;

export const revenueForecasts = pgTable("revenue_forecasts", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	forecastDate: timestamp("forecastDate").notNull(),
	predictedRevenue: integer("predictedRevenue").notNull(),
	actualRevenue: integer("actualRevenue"),
	confidence: integer("confidence").default(80),
	method: varchar("method", { length: 50 }).default('linear_regression'),
	metadata: text("metadata"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
},
(table) => ({
	userIdIdx: index("idx_userId_forecast").on(table.userId),
	forecastDateIdx: index("idx_forecastDate").on(table.forecastDate),
}));

export type RevenueForecast = typeof revenueForecasts.$inferSelect;
export type InsertRevenueForecast = typeof revenueForecasts.$inferInsert;

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	planId: integer("planId").notNull(),
	status: subscriptionStatusEnum("status").notNull(),
	currentPeriodStart: timestamp("currentPeriodStart").notNull(),
	currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
	cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
	stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
	lemonSqueezySubscriptionId: varchar("lemonSqueezySubscriptionId", { length: 255 }),
	trialEndsAt: timestamp("trialEndsAt"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
},
(table) => ({
	userIdIdx: index("idx_userId_sub").on(table.userId),
}));

export const userActivity = pgTable("userActivity", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	action: varchar("action", { length: 255 }).notNull(),
	ipAddress: varchar("ipAddress", { length: 45 }),
	device: varchar("device", { length: 255 }),
	metadata: text("metadata"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	openId: varchar("openId", { length: 64 }).notNull(),
	name: text("name"),
	email: varchar("email", { length: 320 }),
	loginMethod: varchar("loginMethod", { length: 64 }),
	role: userRoleEnum("role").default('user').notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
	lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
	agencyId: integer("agencyId"),
	customPricing: integer("customPricing"),
	interactionQuota: integer("interactionQuota").default(500),
},
(table) => ({
	openIdIdx: index("users_openId_unique").on(table.openId),
}));

export const whiteLabelSettings = pgTable("white_label_settings", {
	id: serial("id").primaryKey(),
	userId: integer("userId").notNull(),
	brandName: varchar("brandName", { length: 255 }),
	brandLogo: text("brandLogo"),
	brandColor: varchar("brandColor", { length: 20 }),
	currency: varchar("currency", { length: 10 }).default('USD'),
	currencySymbol: varchar("currencySymbol", { length: 10 }).default('$'),
	language: varchar("language", { length: 10 }).default('en'),
	locale: varchar("locale", { length: 20 }).default('en-US'),
	rtl: boolean("rtl").default(false),
	voiceModel: varchar("voiceModel", { length: 100 }),
	voiceLanguage: varchar("voiceLanguage", { length: 10 }),
	dateFormat: varchar("dateFormat", { length: 50 }).default('MM/DD/YYYY'),
	timeFormat: varchar("timeFormat", { length: 50 }).default('12h'),
	timezone: varchar("timezone", { length: 100 }).default('UTC'),
	taxRate: integer("taxRate").default(0),
	taxLabel: varchar("taxLabel", { length: 100 }),
	contractTemplate: text("contractTemplate"),
	termsUrl: text("termsUrl"),
	privacyUrl: text("privacyUrl"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
},
(table) => ({
	userIdIdx: index("idx_userId_wl").on(table.userId),
}));

export type WhiteLabelSetting = typeof whiteLabelSettings.$inferSelect;
export type InsertWhiteLabelSetting = typeof whiteLabelSettings.$inferInsert;

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  modelId: integer("modelId"),
  clientName: varchar("clientName", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 50 }),
  eventDate: timestamp("eventDate").notNull(),
  eventType: varchar("eventType", { length: 100 }),
  location: text("location"),
  budget: integer("budget"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: bookingStatusEnum("status").default("pending").notNull(),
  calendarEventId: varchar("calendarEventId", { length: 255 }),
  contractId: integer("contractId"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Contracts table
export const contracts = pgTable("contracts", {
  id: varchar("id", { length: 21 }).primaryKey(), // nanoid
  bookingId: varchar("bookingId", { length: 255 }),
  type: contractTypeEnum("type").notNull(),
  language: contractLanguageEnum("language").default("en").notNull(),
  content: text("content").notNull(),
  status: contractStatusEnum("status").default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  signedAt: timestamp("signedAt"),
  signedBy: varchar("signedBy", { length: 255 }),
  pdfUrl: text("pdfUrl"),
  signatureUrl: text("signatureUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// API Settings table
export const apiSettings = pgTable("api_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  category: apiCategoryEnum("category").notNull(),
  description: text("description"),
  required: boolean("required").default(false).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  updatedBy: varchar("updatedBy", { length: 64 }),
});

export type ApiSetting = typeof apiSettings.$inferSelect;
export type InsertApiSetting = typeof apiSettings.$inferInsert;
