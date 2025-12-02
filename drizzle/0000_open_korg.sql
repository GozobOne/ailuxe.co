CREATE TYPE "public"."api_category" AS ENUM('whatsapp', 'google', 'openrouter', 'stripe', 'lemon_squeezy', 'baileys', 'general');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('available', 'booked_today', 'available_this_week', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('active', 'past', 'prospect', 'lead');--> statement-breakpoint
CREATE TYPE "public"."contract_language" AS ENUM('en', 'ar');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('draft', 'sent', 'signed', 'paid', 'expired');--> statement-breakpoint
CREATE TYPE "public"."contract_type" AS ENUM('service', 'nda', 'non-compete');--> statement-breakpoint
CREATE TYPE "public"."direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('percentage', 'fixed');--> statement-breakpoint
CREATE TYPE "public"."file_type" AS ENUM('txt', 'json', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."interval" AS ENUM('monthly', 'yearly', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'voice', 'image', 'document');--> statement-breakpoint
CREATE TYPE "public"."model_category" AS ENUM('arabic_female', 'european_female', 'male', 'kids');--> statement-breakpoint
CREATE TYPE "public"."oauth_provider" AS ENUM('google', 'instagram', 'facebook');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('whatsapp', 'telegram', 'signal', 'multiple');--> statement-breakpoint
CREATE TYPE "public"."revenue_type" AS ENUM('subscription', 'commission', 'booking');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'trialing');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'agency', 'client');--> statement-breakpoint
CREATE TABLE "api_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"category" "api_category" NOT NULL,
	"description" text,
	"required" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedBy" varchar(64),
	CONSTRAINT "api_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "billing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"interval" interval NOT NULL,
	"features" text,
	"interactionQuota" integer DEFAULT 500,
	"active" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0,
	"stripePriceId" varchar(255),
	"lemonSqueezyVariantId" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"trialDurationDays" integer,
	"trialPrice" integer
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"modelId" integer,
	"clientName" varchar(255),
	"clientEmail" varchar(320),
	"clientPhone" varchar(50),
	"eventDate" timestamp NOT NULL,
	"eventType" varchar(100),
	"location" text,
	"budget" integer,
	"currency" varchar(10) DEFAULT 'USD',
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"calendarEventId" varchar(255),
	"contractId" integer,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatHistories" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"fileName" varchar(255),
	"fileType" "file_type",
	"fileUrl" text,
	"fileKey" text,
	"messageCount" integer,
	"processedAt" timestamp,
	"personaModelId" varchar(255),
	"toneConfig" text,
	"voiceCloneUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(100),
	"phone" varchar(50),
	"phones" text,
	"email" varchar(320),
	"emails" text,
	"website" varchar(500),
	"platform" "platform",
	"status" "contact_status" DEFAULT 'prospect' NOT NULL,
	"tags" text,
	"notes" text,
	"avatarUrl" text,
	"lastContactedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"bookingId" varchar(255),
	"type" "contract_type" NOT NULL,
	"language" "contract_language" DEFAULT 'en' NOT NULL,
	"content" text NOT NULL,
	"status" "contract_status" DEFAULT 'draft' NOT NULL,
	"sentAt" timestamp,
	"signedAt" timestamp,
	"signedBy" varchar(255),
	"pdfUrl" text,
	"signatureUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"discountType" "discount_type" NOT NULL,
	"discountValue" integer NOT NULL,
	"maxUses" integer,
	"usedCount" integer DEFAULT 0,
	"expiresAt" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"contactId" integer,
	"platform" "platform" NOT NULL,
	"direction" "direction" NOT NULL,
	"messageType" "message_type" DEFAULT 'text',
	"content" text,
	"mediaUrl" text,
	"transcription" text,
	"respondedBy" varchar(255),
	"responseTime" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "model_category" NOT NULL,
	"experience" integer DEFAULT 0,
	"location" varchar(255),
	"dailyRate" integer NOT NULL,
	"rating" integer DEFAULT 0,
	"specialties" text,
	"languages" text,
	"bookingCount" integer DEFAULT 0,
	"phone" varchar(50),
	"email" varchar(320),
	"photoUrl" text,
	"portfolioUrl" text,
	"availability" "availability" DEFAULT 'available',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oauth_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"provider" "oauth_provider" NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text,
	"expiresAt" timestamp,
	"scope" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revenue" (
	"id" serial PRIMARY KEY NOT NULL,
	"agencyId" integer NOT NULL,
	"clientId" integer NOT NULL,
	"bookingId" integer,
	"contactId" integer,
	"revenueType" "revenue_type" NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"month" varchar(7) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revenue_forecasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"forecastDate" timestamp NOT NULL,
	"predictedRevenue" integer NOT NULL,
	"actualRevenue" integer,
	"confidence" integer DEFAULT 80,
	"method" varchar(50) DEFAULT 'linear_regression',
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"planId" integer NOT NULL,
	"status" "subscription_status" NOT NULL,
	"currentPeriodStart" timestamp NOT NULL,
	"currentPeriodEnd" timestamp NOT NULL,
	"cancelAtPeriodEnd" boolean DEFAULT false,
	"stripeSubscriptionId" varchar(255),
	"lemonSqueezySubscriptionId" varchar(255),
	"trialEndsAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userActivity" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"action" varchar(255) NOT NULL,
	"ipAddress" varchar(45),
	"device" varchar(255),
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	"agencyId" integer,
	"customPricing" integer,
	"interactionQuota" integer DEFAULT 500
);
--> statement-breakpoint
CREATE TABLE "white_label_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"brandName" varchar(255),
	"brandLogo" text,
	"brandColor" varchar(20),
	"currency" varchar(10) DEFAULT 'USD',
	"currencySymbol" varchar(10) DEFAULT '$',
	"language" varchar(10) DEFAULT 'en',
	"locale" varchar(20) DEFAULT 'en-US',
	"rtl" boolean DEFAULT false,
	"voiceModel" varchar(100),
	"voiceLanguage" varchar(10),
	"dateFormat" varchar(50) DEFAULT 'MM/DD/YYYY',
	"timeFormat" varchar(50) DEFAULT '12h',
	"timezone" varchar(100) DEFAULT 'UTC',
	"taxRate" integer DEFAULT 0,
	"taxLabel" varchar(100),
	"contractTemplate" text,
	"termsUrl" text,
	"privacyUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_userId" ON "contacts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_status" ON "contacts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "code_idx" ON "coupons" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_userId_msg" ON "messages" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_contactId_msg" ON "messages" USING btree ("contactId");--> statement-breakpoint
CREATE INDEX "idx_platform_msg" ON "messages" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "idx_user_provider" ON "oauth_tokens" USING btree ("userId","provider");--> statement-breakpoint
CREATE INDEX "idx_agencyId" ON "revenue" USING btree ("agencyId");--> statement-breakpoint
CREATE INDEX "idx_clientId" ON "revenue" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "idx_contactId_rev" ON "revenue" USING btree ("contactId");--> statement-breakpoint
CREATE INDEX "idx_userId_forecast" ON "revenue_forecasts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_forecastDate" ON "revenue_forecasts" USING btree ("forecastDate");--> statement-breakpoint
CREATE INDEX "idx_userId_sub" ON "subscriptions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "users_openId_unique" ON "users" USING btree ("openId");--> statement-breakpoint
CREATE INDEX "idx_userId_wl" ON "white_label_settings" USING btree ("userId");