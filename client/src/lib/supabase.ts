import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Client {
  id: string;
  clerk_user_id: string;
  clerk_org_id?: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  tier: 'free' | 'starter' | 'pro' | 'elite';
  subscription_status: 'trial' | 'active' | 'cancelled' | 'expired';
  trial_ends_at?: string;
  subscription_ends_at?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  custom_domain?: string;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  privacy_accepted: boolean;
  privacy_accepted_at?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Booking {
  id: string;
  client_id: string;
  tenant_id: string;
  event_name: string;
  event_type?: string;
  event_date: string;
  event_location?: string;
  guest_count?: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  budget_min?: number;
  budget_max?: number;
  quoted_price?: number;
  final_price?: number;
  deposit_paid: boolean;
  deposit_amount?: number;
  contract_generated: boolean;
  contract_url?: string;
  contract_signed: boolean;
  contract_signed_at?: string;
  ai_conversation_id?: string;
  ai_confidence_score?: number;
  escalated_to_human: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface TeamMember {
  id: string;
  client_id: string;
  tenant_id: string;
  clerk_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'owner' | 'admin' | 'billing' | 'viewer';
  status: 'invited' | 'active' | 'suspended' | 'removed';
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions
export async function getClientByClerkId(clerkUserId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    return null;
  }

  return data;
}

export async function getBookingsByTenant(tenantId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

export async function getTeamMembers(tenantId: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data || [];
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }

  return data;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return null;
  }

  return data;
}

export async function inviteTeamMember(member: Partial<TeamMember>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select()
    .single();

  if (error) {
    console.error('Error inviting team member:', error);
    return null;
  }

  return data;
}

export async function updateTeamMemberRole(
  id: string,
  role: TeamMember['role']
): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating team member role:', error);
    return null;
  }

  return data;
}

export async function removeTeamMember(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing team member:', error);
    return false;
  }

  return true;
}
