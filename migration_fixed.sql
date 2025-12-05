-- =============================================================================
-- AI LUXE - Add Missing Tables (Idempotent Version)
-- Migration 002: Add bots, contacts, integrations, workflows, templates
-- Created: December 5, 2025
-- This script is safe to run multiple times.
-- =============================================================================

-- =============================================================================
-- BOTS TABLE
-- =============================================================================
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

DROP INDEX IF EXISTS public.idx_bots_client_id;
DROP INDEX IF EXISTS public.idx_bots_tenant_id;
DROP INDEX IF EXISTS public.idx_bots_platform;
CREATE INDEX idx_bots_client_id ON public.bots(client_id);
CREATE INDEX idx_bots_tenant_id ON public.bots(tenant_id);
CREATE INDEX idx_bots_platform ON public.bots(platform);

ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tenant bots" ON public.bots;
CREATE POLICY "Users can view own tenant bots"
  ON public.bots FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- =============================================================================
-- CONTACTS TABLE
-- =============================================================================
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

DROP INDEX IF EXISTS public.idx_contacts_client_id;
DROP INDEX IF EXISTS public.idx_contacts_tenant_id;
DROP INDEX IF EXISTS public.idx_contacts_email;
CREATE INDEX idx_contacts_client_id ON public.contacts(client_id);
CREATE INDEX idx_contacts_tenant_id ON public.contacts(tenant_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tenant contacts" ON public.contacts;
CREATE POLICY "Users can view own tenant contacts"
  ON public.contacts FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- =============================================================================
-- INTEGRATIONS TABLE
-- =============================================================================
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

DROP INDEX IF EXISTS public.idx_integrations_client_id;
DROP INDEX IF EXISTS public.idx_integrations_tenant_id;
CREATE INDEX idx_integrations_client_id ON public.integrations(client_id);
CREATE INDEX idx_integrations_tenant_id ON public.integrations(tenant_id);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tenant integrations" ON public.integrations;
CREATE POLICY "Users can view own tenant integrations"
  ON public.integrations FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- =============================================================================
-- WORKFLOWS TABLE
-- =============================================================================
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

DROP INDEX IF EXISTS public.idx_workflows_client_id;
DROP INDEX IF EXISTS public.idx_workflows_tenant_id;
CREATE INDEX idx_workflows_client_id ON public.workflows(client_id);
CREATE INDEX idx_workflows_tenant_id ON public.workflows(tenant_id);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tenant workflows" ON public.workflows;
CREATE POLICY "Users can view own tenant workflows"
  ON public.workflows FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- =============================================================================
-- TEMPLATES TABLE
-- =============================================================================
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

DROP INDEX IF EXISTS public.idx_templates_client_id;
DROP INDEX IF EXISTS public.idx_templates_tenant_id;
CREATE INDEX idx_templates_client_id ON public.templates(client_id);
CREATE INDEX idx_templates_tenant_id ON public.templates(tenant_id);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tenant templates" ON public.templates;
CREATE POLICY "Users can view own tenant templates"
  ON public.templates FOR SELECT
  USING (is_public = TRUE OR tenant_id IN (SELECT tenant_id FROM public.clients WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'));

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
