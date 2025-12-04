import type { RequestHandler } from 'express';
import { handleClerkWebhook } from '../../clerk-webhook';

/**
 * Clerk Webhook Endpoint
 * POST /api/webhooks/clerk
 * 
 * Handles Clerk webhook events:
 * - user.created: Create client and team member records
 * - user.updated: Update client information
 * - user.deleted: Delete client and related data
 * - organization.created: Link organization to client
 * - organizationMembership.created: Add team member
 * - organizationMembership.updated: Update team member role
 * - organizationMembership.deleted: Remove team member
 */
export const POST: RequestHandler = async (req, res) => {
  return handleClerkWebhook(req, res);
};
