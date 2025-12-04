import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/backend';
import { createClient } from '@supabase/supabase-js';

// Supabase admin client (bypasses RLS)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Clerk webhook secret
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

/**
 * Generate a unique tenant ID from email or name
 */
function generateTenantId(email: string, name?: string): string {
  const base = name || email.split('@')[0];
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Add random suffix to ensure uniqueness
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
}

/**
 * Handle Clerk webhook events
 */
export async function handleClerkWebhook(req: any, res: any) {
  try {
    // Get webhook headers
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    // Get the body
    const body = JSON.stringify(req.body);

    // Create Svix instance
    const wh = new Webhook(webhookSecret);

    let event: WebhookEvent;

    // Verify the webhook
    try {
      event = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle different event types
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event);
        break;
      
      case 'user.updated':
        await handleUserUpdated(event);
        break;
      
      case 'user.deleted':
        await handleUserDeleted(event);
        break;
      
      case 'organization.created':
        await handleOrganizationCreated(event);
        break;
      
      case 'organizationMembership.created':
        await handleOrganizationMembershipCreated(event);
        break;
      
      case 'organizationMembership.updated':
        await handleOrganizationMembershipUpdated(event);
        break;
      
      case 'organizationMembership.deleted':
        await handleOrganizationMembershipDeleted(event);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle user.created event
 */
async function handleUserCreated(event: WebhookEvent) {
  if (event.type !== 'user.created') return;

  const { id, email_addresses, first_name, last_name, image_url } = event.data;
  
  const primaryEmail = email_addresses.find(e => e.id === event.data.primary_email_address_id);
  if (!primaryEmail) {
    console.error('No primary email found for user:', id);
    return;
  }

  const email = primaryEmail.email_address;
  const name = [first_name, last_name].filter(Boolean).join(' ') || email.split('@')[0];
  const tenantId = generateTenantId(email, name);

  console.log(`Creating client for user ${id} with tenant_id ${tenantId}`);

  // Insert into clients table
  const { data, error } = await supabase
    .from('clients')
    .insert({
      clerk_user_id: id,
      tenant_id: tenantId,
      name: name,
      email: email,
      tier: 'free',
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
      terms_accepted: false,
      privacy_accepted: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return;
  }

  console.log('Client created successfully:', data);

  // Create owner team member record
  await supabase
    .from('team_members')
    .insert({
      client_id: data.id,
      tenant_id: tenantId,
      clerk_user_id: id,
      email: email,
      name: name,
      avatar_url: image_url,
      role: 'owner',
      status: 'active',
      joined_at: new Date().toISOString(),
    });

  console.log('Owner team member created');
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(event: WebhookEvent) {
  if (event.type !== 'user.updated') return;

  const { id, email_addresses, first_name, last_name, image_url } = event.data;
  
  const primaryEmail = email_addresses.find(e => e.id === event.data.primary_email_address_id);
  if (!primaryEmail) return;

  const email = primaryEmail.email_address;
  const name = [first_name, last_name].filter(Boolean).join(' ') || email.split('@')[0];

  // Update client record
  await supabase
    .from('clients')
    .update({
      name: name,
      email: email,
      last_login_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', id);

  // Update team member record
  await supabase
    .from('team_members')
    .update({
      name: name,
      email: email,
      avatar_url: image_url,
    })
    .eq('clerk_user_id', id);

  console.log('User updated:', id);
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(event: WebhookEvent) {
  if (event.type !== 'user.deleted') return;

  const { id } = event.data;

  // Delete client (cascade will delete bookings and team members)
  await supabase
    .from('clients')
    .delete()
    .eq('clerk_user_id', id);

  console.log('User deleted:', id);
}

/**
 * Handle organization.created event
 */
async function handleOrganizationCreated(event: WebhookEvent) {
  if (event.type !== 'organization.created') return;

  const { id, name, created_by } = event.data;
  
  // Update client with organization ID
  await supabase
    .from('clients')
    .update({
      clerk_org_id: id,
      company_name: name,
    })
    .eq('clerk_user_id', created_by);

  console.log('Organization created:', id);
}

/**
 * Handle organizationMembership.created event
 */
async function handleOrganizationMembershipCreated(event: WebhookEvent) {
  if (event.type !== 'organizationMembership.created') return;

  const { organization, public_user_data, role } = event.data;
  
  // Get the client for this organization
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('clerk_org_id', organization.id)
    .single();

  if (!client) {
    console.error('Client not found for organization:', organization.id);
    return;
  }

  // Map Clerk role to our role system
  const roleMapping: Record<string, 'owner' | 'admin' | 'billing' | 'viewer'> = {
    'org:admin': 'admin',
    'org:member': 'viewer',
  };

  const memberRole = roleMapping[role] || 'viewer';

  // Add team member
  await supabase
    .from('team_members')
    .insert({
      client_id: client.id,
      tenant_id: client.tenant_id,
      clerk_user_id: public_user_data.user_id,
      email: public_user_data.identifier,
      name: `${public_user_data.first_name} ${public_user_data.last_name}`.trim(),
      avatar_url: public_user_data.image_url,
      role: memberRole,
      status: 'active',
      joined_at: new Date().toISOString(),
    });

  console.log('Organization member added:', public_user_data.user_id);
}

/**
 * Handle organizationMembership.updated event
 */
async function handleOrganizationMembershipUpdated(event: WebhookEvent) {
  if (event.type !== 'organizationMembership.updated') return;

  const { public_user_data, role } = event.data;

  // Map Clerk role to our role system
  const roleMapping: Record<string, 'owner' | 'admin' | 'billing' | 'viewer'> = {
    'org:admin': 'admin',
    'org:member': 'viewer',
  };

  const memberRole = roleMapping[role] || 'viewer';

  // Update team member role
  await supabase
    .from('team_members')
    .update({ role: memberRole })
    .eq('clerk_user_id', public_user_data.user_id);

  console.log('Organization member updated:', public_user_data.user_id);
}

/**
 * Handle organizationMembership.deleted event
 */
async function handleOrganizationMembershipDeleted(event: WebhookEvent) {
  if (event.type !== 'organizationMembership.deleted') return;

  const { public_user_data } = event.data;

  // Remove team member
  await supabase
    .from('team_members')
    .update({ status: 'removed' })
    .eq('clerk_user_id', public_user_data.user_id);

  console.log('Organization member removed:', public_user_data.user_id);
}
