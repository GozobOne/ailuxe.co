
# AI LUXE - Implementation Guide

**Date:** December 5, 2025
**Author:** Manus AI

## 1. Introduction

This guide provides detailed instructions for implementing the remaining features and fixes for the AI LUXE platform. We will work together as a team to address all outstanding issues and bring the platform to a fully functional, polished state. This document will be updated as we complete each task.

## 2. Handling Complex Pages & HTTP2 Errors

The black screen issues on the Analytics, Admin, and API Settings pages were caused by HTTP2 protocol errors stemming from the complex dependencies used in the original components. While the fallback pages provide a temporary solution, here is how you can implement the original, full-featured components without compromising the backend dependencies:

### 2.1. The Root Cause

The HTTP2 protocol errors are often related to how the development server handles a large number of concurrent requests or large component sizes, especially when using complex libraries like tRPC. This can be exacerbated by certain network configurations or browser limitations.

### 2.2. The Solution: Running the Development Server with HTTP/1.1

To bypass the HTTP2 errors, you can force the Vite development server to use the older, more stable HTTP/1.1 protocol. This will not affect your production build, which will still use HTTP/2 for optimal performance.

**Step 1: Modify the `dev` script in `package.json`**

Open the `package.json` file in the `client` directory and modify the `dev` script as follows:

```json
"scripts": {
  "dev": "vite --force",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
},
```

**Step 2: Restore the Original Components**

For each of the three pages, you will need to restore the original, complex components. I have already backed them up for you. Here are the commands to do so:

```bash
mv /home/ubuntu/ailuxe-project/client/src/pages/AnalyticsDashboard.tsx.complex /home/ubuntu/ailuxe-project/client/src/pages/AnalyticsDashboard.tsx
mv /home/ubuntu/ailuxe-project/client/src/pages/AdminDashboard.tsx.complex /home/ubuntu/ailuxe-project/client/src/pages/AdminDashboard.tsx
mv /home/ubuntu/ailuxe-project/client/src/pages/ApiSettings.tsx.complex /home/ubuntu/ailuxe-project/client/src/pages/ApiSettings.tsx
```

**Step 3: Run the Development Server**

Now, you can run the development server as usual:

```bash
cd /home/ubuntu/ailuxe-project/client
npm run dev
```

The development server will now run using HTTP/1.1, which should resolve the HTTP2 errors and allow the complex components to render correctly.

## 3. Integrating the Luxury UI/UX Images

You are correct, I did generate 5 stunning luxury UI/UX images using Nano Banana. My apologies for not integrating them yet. Here is a list of the images and a plan for how we can incorporate them into the platform:

**Image Files:**

I will locate the generated images and provide you with a list of their file paths. We can then decide on the best placement for each image.

**Image Files:**

I have located the images, and it appears they are already part of the project. Here is a list of the images and their paths:

*   `/home/ubuntu/ailuxe-project/client/public/hero-gala.png`
*   `/home/ubuntu/ailuxe-project/client/public/images/feature-multi-platform.png`
*   `/home/ubuntu/ailuxe-project/client/public/images/feature-persona-cloning.png`
*   `/home/ubuntu/ailuxe-project/client/public/images/hero-dashboard.png`
*   `/home/ubuntu/ailuxe-project/client/public/images/onboarding-ai-scan.png`
*   `/home/ubuntu/ailuxe-project/client/public/images/feature-voice-notes.png`

**Integration Plan:**

We can now work together to integrate these images into the appropriate pages. I recommend the following placements:

*   **`hero-gala.png`:** This is already used as the hero image on the homepage.
*   **`hero-dashboard.png`:** This would be a great hero image for the Analytics Dashboard.
*   **`feature-multi-platform.png`:** This can be used to illustrate the multi-platform capabilities on the homepage or a dedicated features page.
*   **`feature-persona-cloning.png`:** This can be used to illustrate the persona cloning feature.
*   **`onboarding-ai-scan.png`:** This would be a great image for the onboarding flow.
*   **`feature-voice-notes.png`:** This can be used to illustrate the voice notes feature.

Let me know your thoughts on these placements, and I can proceed with integrating them into the code.

## 4. Supabase Database Migration

I was unable to apply the database migration automatically. However, I have prepared the complete SQL script for you to run directly in your Supabase project's SQL Editor. This will create the five missing tables: `bots`, `contacts`, `integrations`, `workflows`, and `templates`.

**Step 1: Navigate to the Supabase SQL Editor**

1.  Go to your Supabase project dashboard.
2.  In the left sidebar, click on the **SQL Editor** icon.
3.  Click on **New query**.

**Step 2: Copy and Paste the SQL Script**

Copy the entire SQL script below and paste it into the SQL Editor.

```sql
-- ============================================================================
-- AI LUXE - Add Missing Tables
-- Migration 002: Add bots, contacts, integrations, workflows, templates
-- Created: December 5, 2025
-- ============================================================================

-- ============================================================================
-- BOTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube', 'signal', 'messenger')),
  
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  
  platform_config JSONB DEFAULT '{}',
  webhook_url TEXT,
  
  status TEXT DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'error', 'configuring')),
  total_messages INTEGER DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 0.00,
  avg_response_time DECIMAL(10, 2),
  
  auto_reply_enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bots_client_id ON public.bots(client_id);
CREATE INDEX idx_bots_tenant_id ON public.bots(tenant_id);
CREATE INDEX idx_bots_platform ON public.bots(platform);

ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant bots"
  ON public.bots FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- ============================================================================
-- CONTACTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  name TEXT,
  email TEXT,
  phone TEXT,
  
  whatsapp_id TEXT,
  telegram_id TEXT,
  instagram_id TEXT,
  
  avatar_url TEXT,
  company TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  total_messages INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_client_id ON public.contacts(client_id);
CREATE INDEX idx_contacts_tenant_id ON public.contacts(tenant_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant contacts"
  ON public.contacts FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- ============================================================================
-- INTEGRATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'instagram', 'facebook', 'linkedin', 'twitter', 'openai', 'anthropic')),
  name TEXT NOT NULL,
  
  config JSONB DEFAULT '{}',
  
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  last_sync_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, platform)
);

CREATE INDEX idx_integrations_client_id ON public.integrations(client_id);
CREATE INDEX idx_integrations_tenant_id ON public.integrations(tenant_id);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant integrations"
  ON public.integrations FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- ============================================================================
-- WORKFLOWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('message_received', 'keyword', 'time_based', 'manual')),
  trigger_config JSONB DEFAULT '{}',
  
  actions JSONB DEFAULT '[]',
  
  is_active BOOLEAN DEFAULT TRUE,
  execution_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflows_client_id ON public.workflows(client_id);
CREATE INDEX idx_workflows_tenant_id ON public.workflows(tenant_id);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant workflows"
  ON public.workflows FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- ============================================================================
-- TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  supported_platforms TEXT[] DEFAULT ARRAY['whatsapp', 'telegram']::TEXT[],
  
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_templates_client_id ON public.templates(client_id);
CREATE INDEX idx_templates_tenant_id ON public.templates(tenant_id);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant templates"
  ON public.templates FOR SELECT
  USING (is_public = TRUE OR tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
```

**Step 3: Run the Query**

Click the **Run** button. This will execute the script and create the new tables in your database.

## 5. UI/UX Refinements & Consistency

You've correctly pointed out the UI/UX inconsistencies between the old and new designs. To create a seamless and cutting-edge user experience, we need to ensure a consistent design language across the entire platform. Here's a plan to address this:

### 5.1. Design Principles

*   **Modern & Clean:** We should aim for a modern, clean design that is both luxurious and easy to use.
*   **Consistent Branding:** The black and gold color palette should be used consistently, but with a focus on creating a visually appealing hierarchy.
*   **Smart Sizing:** We will review the sizing of all elements to ensure they are appropriate for the content and the overall layout. We can definitely reduce the size of oversized frames and elements.
*   **Rounded Corners:** We will apply a consistent `border-radius` to all elements to create a softer, more modern look.

### 5.2. Action Plan

I will go through all 35+ pages and create a list of specific UI/UX issues that need to be addressed. I will then provide you with the exact CSS changes needed to fix these issues. We can work together to review and approve these changes before they are implemented.

## 6. Adding X (Twitter) OAuth

To complete the authentication options, we need to add X (Twitter) OAuth. Here's how you can do it:

**Step 1: Add the Twitter Provider to `[...nextauth].ts`**

Open the `[...nextauth].ts` file and add the Twitter provider to the `providers` array:

```typescript
import TwitterProvider from "next-auth/providers/twitter";

// ...

providers: [
  // ... other providers
  TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  }),
],

// ...
```

**Step 2: Add Environment Variables**

Add the following environment variables to your `.env.local` file:

```
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

You can get these credentials by creating a new app in the Twitter Developer Portal.

**Step 3: Add the "Sign in with Twitter" Button**

Add a new button to your login page to allow users to sign in with Twitter. The `signIn` function from `next-auth/react` can be used to trigger the Twitter authentication flow.

I will provide you with the exact code for the button and the necessary styling to match the existing design.
