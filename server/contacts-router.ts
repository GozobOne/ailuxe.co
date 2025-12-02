import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createContact,
  getContactsByUser,
  getContactById,
  updateContact,
  deleteContact,
  getContactsByStatus,
  searchContacts,
  getContactMessageHistory,
} from "./db";

export const contactsRouter = router({
  // Get all contacts for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getContactsByUser(ctx.user.id);
  }),

  // Get contacts by status
  listByStatus: protectedProcedure
    .input(z.object({
      status: z.enum(['active', 'past', 'prospect', 'lead']),
    }))
    .query(async ({ ctx, input }) => {
      return await getContactsByStatus(ctx.user.id, input.status);
    }),

  // Get single contact by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getContactById(input.id, ctx.user.id);
    }),

  // Create new contact
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      platform: z.enum(['whatsapp', 'telegram', 'signal', 'multiple']).optional(),
      status: z.enum(['active', 'past', 'prospect', 'lead']).optional(),
      tags: z.string().optional(),
      notes: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await createContact({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Update existing contact
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      platform: z.enum(['whatsapp', 'telegram', 'signal', 'multiple']).optional(),
      status: z.enum(['active', 'past', 'prospect', 'lead']).optional(),
      tags: z.string().optional(),
      notes: z.string().optional(),
      avatarUrl: z.string().optional(),
      lastContactedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await updateContact(id, ctx.user.id, data);
    }),

  // Delete contact
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await deleteContact(input.id, ctx.user.id);
    }),

  // Search contacts
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return await searchContacts(ctx.user.id, input.query);
    }),

  // Get contact message history
  getMessageHistory: protectedProcedure
    .input(z.object({ contactId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getContactMessageHistory(input.contactId, ctx.user.id);
    }),

  // Get all unique tags from contacts (for autocomplete)
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await getContactsByUser(ctx.user.id);
    const tagsSet = new Set<string>();
    
    contacts.forEach((contact) => {
      if (contact.tags) {
        const tags = contact.tags.split(',').map((t) => t.trim()).filter(Boolean);
        tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    
    // Return tags sorted by frequency (most used first)
    const tagsArray = Array.from(tagsSet);
    const tagFrequency = tagsArray.map((tag) => ({
      tag,
      count: contacts.filter((c) => c.tags?.includes(tag)).length,
    }));
    
    return tagFrequency.sort((a, b) => b.count - a.count).map((t) => t.tag);
  }),
});
