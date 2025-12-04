-- AI LUXE - Supabase Multi-Tenant Database Schema
-- Black-Gold Empire Production Database
-- Created: December 2, 2025

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CLIENTS TABLE (Multi-Tenant Organizations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- Clerk 'sub' claim
  clerk_org_id TEXT, -- Clerk organization ID (for team accounts)
  tenant_id TEXT UNIQUE NOT NULL, -- Slug for white-label (e.g., "gala-events")
  
  -- Business Information
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company_name TEXT,
  
  -- Subscription & Billing
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'elite')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  
  -- White-Label Settings
  logo_url TEXT,
  primary_color TEXT DEFAULT '#D4AF37', -- Gold
  secondary_color TEXT DEFAULT '#000000', -- Black
  custom_domain TEXT,
  
  -- Legal Consent
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  privacy_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  
  -- Indexes
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_clerk_user_id ON public.clients(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_clients_clerk_org_id ON public.clients(clerk_org_id);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_id ON public.clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_tier ON public.clients(tier);

-- ============================================================================
-- BOOKINGS TABLE (Event Bookings with RLS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL, -- Denormalized for RLS performance
  
  -- Event Details
  event_name TEXT NOT NULL,
  event_type TEXT, -- wedding, corporate, gala, etc.
  event_date TIMESTAMPTZ NOT NULL,
  event_location TEXT,
  guest_count INTEGER,
  
  -- Client Contact
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  
  -- Booking Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Financial
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  quoted_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_amount DECIMAL(10, 2),
  
  -- Contract
  contract_generated BOOLEAN DEFAULT FALSE,
  contract_url TEXT,
  contract_signed BOOLEAN DEFAULT FALSE,
  contract_signed_at TIMESTAMPTZ,
  
  -- AI Interaction
  ai_conversation_id TEXT,
  ai_confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  escalated_to_human BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT, -- clerk_user_id who created this booking
  
  -- Constraints
  CONSTRAINT valid_budget CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max),
  CONSTRAINT valid_confidence CHECK (ai_confidence_score IS NULL OR (ai_confidence_score >= 0 AND ai_confidence_score <= 1))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON public.bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- ============================================================================
-- TEAM_MEMBERS TABLE (Organization Members with Roles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  
  -- Member Info
  clerk_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  
  -- Role & Permissions
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'billing', 'viewer')),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('invited', 'active', 'suspended', 'removed')),
  invited_by TEXT, -- clerk_user_id who sent invite
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one user per tenant
  UNIQUE(tenant_id, clerk_user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_client_id ON public.team_members(client_id);
CREATE INDEX IF NOT EXISTS idx_team_members_tenant_id ON public.team_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_team_members_clerk_user_id ON public.team_members(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON public.team_members(role);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CLIENTS RLS POLICIES
-- ============================================================================

-- Policy: Users can only see their own client record
CREATE POLICY "Users can view own client record"
  ON public.clients
  FOR SELECT
  USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Policy: Users can update their own client record
CREATE POLICY "Users can update own client record"
  ON public.clients
  FOR UPDATE
  USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Policy: Service role can insert (for Clerk webhooks)
CREATE POLICY "Service role can insert clients"
  ON public.clients
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- BOOKINGS RLS POLICIES
-- ============================================================================

-- Policy: Users can only see bookings for their tenant
CREATE POLICY "Users can view own tenant bookings"
  ON public.bookings
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Policy: Users can insert bookings for their tenant
CREATE POLICY "Users can create bookings for own tenant"
  ON public.bookings
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Policy: Users can update bookings for their tenant
CREATE POLICY "Users can update own tenant bookings"
  ON public.bookings
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Policy: Users can delete bookings for their tenant (admin/owner only)
CREATE POLICY "Admins can delete own tenant bookings"
  ON public.bookings
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tm.tenant_id 
      FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub'
        AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- TEAM_MEMBERS RLS POLICIES
-- ============================================================================

-- Policy: Users can view team members in their tenant
CREATE POLICY "Users can view own tenant team members"
  ON public.team_members
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.clients WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Policy: Owners and admins can invite team members
CREATE POLICY "Admins can invite team members"
  ON public.team_members
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tm.tenant_id 
      FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub'
        AND tm.role IN ('owner', 'admin')
    )
  );

-- Policy: Owners and admins can update team member roles
CREATE POLICY "Admins can update team member roles"
  ON public.team_members
  FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tm.tenant_id 
      FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub'
        AND tm.role IN ('owner', 'admin')
    )
  );

-- Policy: Owners and admins can remove team members
CREATE POLICY "Admins can remove team members"
  ON public.team_members
  FOR DELETE
  USING (
    tenant_id IN (
      SELECT tm.tenant_id 
      FROM public.team_members tm
      WHERE tm.clerk_user_id = auth.jwt() ->> 'sub'
        AND tm.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for team_members
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert test client (will be replaced by Clerk webhook in production)
-- INSERT INTO public.clients (
--   clerk_user_id,
--   tenant_id,
--   name,
--   email,
--   company_name,
--   tier,
--   terms_accepted,
--   privacy_accepted
-- ) VALUES (
--   'user_test123',
--   'gala-events',
--   'Mohammed Al-Rashid',
--   'mohammed@galaevents.ae',
--   'Gala Events',
--   'elite',
--   true,
--   true
-- );

-- ============================================================================
-- GRANTS (For Supabase service role and authenticated users)
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;

-- Grant access to service role (for Clerk webhooks)
GRANT ALL ON public.clients TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.team_members TO service_role;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE public.clients IS 'Multi-tenant client organizations with white-label settings';
COMMENT ON TABLE public.bookings IS 'Event bookings with RLS for tenant isolation';
COMMENT ON TABLE public.team_members IS 'Organization team members with role-based access';

COMMENT ON COLUMN public.clients.clerk_user_id IS 'Clerk sub claim from JWT';
COMMENT ON COLUMN public.clients.clerk_org_id IS 'Clerk organization ID for team accounts';
COMMENT ON COLUMN public.clients.tenant_id IS 'Unique slug for white-label branding';
COMMENT ON COLUMN public.bookings.tenant_id IS 'Denormalized for RLS query performance';
COMMENT ON COLUMN public.team_members.role IS 'owner: full access, admin: manage team, billing: view invoices, viewer: read-only';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
