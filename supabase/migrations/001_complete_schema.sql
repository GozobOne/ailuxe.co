-- ============================================================================
-- AI LUXE COMPLETE DATABASE SCHEMA
-- Migration 001: Add all missing tables for full feature set
-- Created: December 5, 2025
-- ============================================================================

-- ============================================================================
-- PERSONAS TABLE (AI Persona Cloning)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  owner_id TEXT NOT NULL, -- clerk_user_id of creator
  
  -- Persona Details
  name TEXT NOT NULL,
  description TEXT,
  persona_type TEXT CHECK (persona_type IN ('whatsapp_txt', 'telegram_json', 'instagram_dm', 'pdf', 'website', 'linkedin', 'custom')),
  
  -- Training Data
  source_file_url TEXT,
  source_file_type TEXT,
  message_count INTEGER DEFAULT 0,
  training_status TEXT DEFAULT 'pending' CHECK (training_status IN ('pending', 'processing', 'active', 'failed')),
  
  -- AI Configuration
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'friendly', 'formal', 'casual', 'luxury')),
  language TEXT DEFAULT 'en',
  response_style TEXT,
  custom_instructions TEXT,
  
  -- Model Settings
  ai_model TEXT DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(2, 1) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 500,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_personas_client_id ON public.personas(client_id);
CREATE INDEX IF NOT EXISTS idx_personas_tenant_id ON public.personas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_personas_owner_id ON public.personas(owner_id);
CREATE INDEX IF NOT EXISTS idx_personas_training_status ON public.personas(training_status);

-- ============================================================================
-- BOTS TABLE (Multi-Platform Bot Configuration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Bot Details
  name TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube', 'signal', 'messenger')),
  
  -- Persona Assignment
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  
  -- Platform Configuration
  platform_config JSONB DEFAULT '{}', -- Platform-specific settings
  webhook_url TEXT,
  api_key_encrypted TEXT,
  
  -- Status & Metrics
  status TEXT DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'error', 'configuring')),
  total_messages INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 0.00, -- Percentage
  avg_response_time DECIMAL(10, 2), -- Seconds
  
  -- Features
  auto_reply_enabled BOOLEAN DEFAULT TRUE,
  human_handoff_enabled BOOLEAN DEFAULT TRUE,
  human_handoff_threshold DECIMAL(3, 2) DEFAULT 0.70, -- Confidence threshold
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bots_client_id ON public.bots(client_id);
CREATE INDEX IF NOT EXISTS idx_bots_tenant_id ON public.bots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bots_platform ON public.bots(platform);
CREATE INDEX IF NOT EXISTS idx_bots_persona_id ON public.bots(persona_id);
CREATE INDEX IF NOT EXISTS idx_bots_status ON public.bots(status);

-- ============================================================================
-- CONTACTS TABLE (Unified Contact Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Contact Information
  name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Platform Identifiers
  whatsapp_id TEXT,
  telegram_id TEXT,
  instagram_id TEXT,
  facebook_id TEXT,
  linkedin_id TEXT,
  twitter_id TEXT,
  tiktok_id TEXT,
  youtube_id TEXT,
  signal_id TEXT,
  
  -- Profile
  avatar_url TEXT,
  company TEXT,
  title TEXT,
  location TEXT,
  timezone TEXT,
  language TEXT DEFAULT 'en',
  
  -- Tags & Segmentation
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  segment TEXT,
  vip_status BOOLEAN DEFAULT FALSE,
  
  -- Interaction Stats
  total_messages INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  first_contact_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- AI Insights
  sentiment_score DECIMAL(3, 2), -- -1.00 to 1.00
  engagement_score DECIMAL(3, 2), -- 0.00 to 1.00
  ai_summary TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one contact per tenant per platform ID
  UNIQUE(tenant_id, whatsapp_id),
  UNIQUE(tenant_id, telegram_id),
  UNIQUE(tenant_id, instagram_id)
);

CREATE INDEX IF NOT EXISTS idx_contacts_client_id ON public.contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON public.contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON public.contacts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_contacts_vip_status ON public.contacts(vip_status);

-- ============================================================================
-- MESSAGES TABLE (Multi-Platform Message Hub)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Conversation
  conversation_id TEXT NOT NULL, -- Unique per contact per platform
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE SET NULL,
  
  -- Message Details
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube', 'signal', 'messenger')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  
  -- Content
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'location', 'contact', 'sticker')),
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  
  -- AI Processing
  ai_generated BOOLEAN DEFAULT FALSE,
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  ai_confidence DECIMAL(3, 2), -- 0.00 to 1.00
  ai_intent TEXT,
  ai_entities JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  
  -- Human Handoff
  escalated_to_human BOOLEAN DEFAULT FALSE,
  escalated_at TIMESTAMPTZ,
  escalated_reason TEXT,
  handled_by TEXT, -- clerk_user_id
  
  -- Metadata
  platform_message_id TEXT, -- External platform ID
  reply_to_message_id UUID REFERENCES public.messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_messages_client_id ON public.messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_tenant_id ON public.messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_contact_id ON public.messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_bot_id ON public.messages(bot_id);
CREATE INDEX IF NOT EXISTS idx_messages_platform ON public.messages(platform);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON public.messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_escalated ON public.messages(escalated_to_human);

-- ============================================================================
-- INTEGRATIONS TABLE (Platform API Connections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Integration Details
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube', 'signal', 'messenger', 'openai', 'anthropic', 'deepseek')),
  name TEXT NOT NULL,
  description TEXT,
  
  -- Authentication
  auth_type TEXT CHECK (auth_type IN ('api_key', 'oauth', 'webhook', 'token')),
  api_key_encrypted TEXT,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Configuration
  config JSONB DEFAULT '{}',
  webhook_url TEXT,
  webhook_secret_encrypted TEXT,
  
  -- Status
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one integration per platform per tenant
  UNIQUE(tenant_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_integrations_client_id ON public.integrations(client_id);
CREATE INDEX IF NOT EXISTS idx_integrations_tenant_id ON public.integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_integrations_platform ON public.integrations(platform);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON public.integrations(status);

-- ============================================================================
-- WORKFLOWS TABLE (Automation Workflows)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Workflow Details
  name TEXT NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('message_received', 'keyword', 'time_based', 'manual', 'webhook')),
  trigger_config JSONB DEFAULT '{}',
  
  -- Actions
  actions JSONB DEFAULT '[]', -- Array of action objects
  
  -- Conditions
  conditions JSONB DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT -- clerk_user_id
);

CREATE INDEX IF NOT EXISTS idx_workflows_client_id ON public.workflows(client_id);
CREATE INDEX IF NOT EXISTS idx_workflows_tenant_id ON public.workflows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflows_is_active ON public.workflows(is_active);

-- ============================================================================
-- TEMPLATES TABLE (Message Templates)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Template Details
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  -- Content
  template_type TEXT DEFAULT 'text' CHECK (template_type IN ('text', 'image', 'video', 'file', 'interactive')),
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[], -- List of {{variable}} names
  
  -- Platform Support
  supported_platforms TEXT[] DEFAULT ARRAY['whatsapp', 'telegram', 'instagram']::TEXT[],
  
  -- Usage Stats
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT, -- clerk_user_id
  is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_templates_client_id ON public.templates(client_id);
CREATE INDEX IF NOT EXISTS idx_templates_tenant_id ON public.templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);

-- ============================================================================
-- AUDIT_LOGS TABLE (Complete Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT,
  
  -- Action Details
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
  resource_type TEXT NOT NULL, -- 'booking', 'bot', 'persona', etc.
  resource_id UUID,
  
  -- Actor
  performed_by TEXT, -- clerk_user_id
  performed_by_role TEXT,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_client_id ON public.audit_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_by ON public.audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PERSONAS RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant personas"
  ON public.personas
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can create personas for own tenant"
  ON public.personas
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own personas"
  ON public.personas
  FOR UPDATE
  USING (
    owner_id = auth.jwt() ->> 'sub' OR
    tenant_id IN (
      SELECT tm.tenant_id FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub' AND tm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete personas"
  ON public.personas
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub' AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- BOTS RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant bots"
  ON public.bots
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Admins can manage bots"
  ON public.bots
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub' AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- CONTACTS RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant contacts"
  ON public.contacts
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can manage own tenant contacts"
  ON public.contacts
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- ============================================================================
-- MESSAGES RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant messages"
  ON public.messages
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can create messages for own tenant"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own tenant messages"
  ON public.messages
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- ============================================================================
-- INTEGRATIONS RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant integrations"
  ON public.integrations
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Admins can manage integrations"
  ON public.integrations
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub' AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- WORKFLOWS RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant workflows"
  ON public.workflows
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Admins can manage workflows"
  ON public.workflows
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub' AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- TEMPLATES RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant templates and public templates"
  ON public.templates
  FOR SELECT
  USING (
    is_public = TRUE OR
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can create templates for own tenant"
  ON public.templates
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own templates"
  ON public.templates
  FOR UPDATE
  USING (
    created_by = auth.jwt() ->> 'sub' OR
    tenant_id IN (
      SELECT tm.tenant_id FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub' AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- AUDIT_LOGS RLS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tenant audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at for all tables
CREATE TRIGGER update_personas_updated_at
  BEFORE UPDATE ON public.personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bots_updated_at
  BEFORE UPDATE ON public.bots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Get user's tenant ID from JWT
CREATE OR REPLACE FUNCTION public.get_jwt_tenant()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM public.clients 
    WHERE clerk_user_id = auth.jwt() ->> 'sub'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's tenant UUID from JWT
CREATE OR REPLACE FUNCTION public.get_jwt_tenant_uuid()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM public.clients 
    WHERE clerk_user_id = auth.jwt() ->> 'sub'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's role in tenant
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.team_members 
    WHERE clerk_user_id = auth.jwt() ->> 'sub'
    AND tenant_id = public.get_jwt_tenant()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert default message templates
INSERT INTO public.templates (client_id, tenant_id, name, description, category, content, variables, supported_platforms, is_public, created_by)
SELECT 
  c.id,
  c.tenant_id,
  'Welcome Message',
  'Standard welcome message for new contacts',
  'greeting',
  'Hello {{name}}! Welcome to {{company_name}}. How can we assist you today?',
  ARRAY['name', 'company_name'],
  ARRAY['whatsapp', 'telegram', 'instagram'],
  TRUE,
  c.clerk_user_id
FROM public.clients c
WHERE NOT EXISTS (
  SELECT 1 FROM public.templates WHERE name = 'Welcome Message' AND tenant_id = c.tenant_id
)
LIMIT 1;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
