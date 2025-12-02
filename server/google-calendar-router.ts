import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  getGoogleAuthUrl,
  createCalendarEvent,
  checkAvailability,
  getUpcomingEvents,
  deleteCalendarEvent,
  getConnectionStatus,
} from "./google-calendar";

/**
 * Google Calendar tRPC Router
 */

export const googleCalendarRouter = router({
  /**
   * Get OAuth URL for Google Calendar authorization
   */
  getAuthUrl: protectedProcedure.query(async ({ ctx }) => {
    const url = await getGoogleAuthUrl(ctx.user.id);
    return { url };
  }),

  /**
   * Get Google Calendar connection status
   */
  getConnectionStatus: protectedProcedure.query(async ({ ctx }) => {
    const status = await getConnectionStatus(ctx.user.id);
    return status;
  }),

  /**
   * Create calendar event
   */
  createEvent: protectedProcedure
    .input(
      z.object({
        summary: z.string().min(1).max(500),
        description: z.string().max(2000).optional(),
        start: z.object({
          dateTime: z.string(),
          timeZone: z.string().optional(),
        }),
        end: z.object({
          dateTime: z.string(),
          timeZone: z.string().optional(),
        }),
        attendees: z.array(z.object({ email: z.string().email() })).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await createCalendarEvent(ctx.user.id, input);
      return event;
    }),

  /**
   * Check if time slot is available
   */
  checkAvailability: protectedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const available = await checkAvailability(ctx.user.id, input.start, input.end);
      return { available };
    }),

  /**
   * Get upcoming events
   */
  getUpcomingEvents: protectedProcedure
    .input(
      z
        .object({
          maxResults: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const events = await getUpcomingEvents(ctx.user.id, input?.maxResults);
      return events;
    }),

  /**
   * Delete calendar event
   */
  deleteEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await deleteCalendarEvent(ctx.user.id, input.eventId);
      return { success: true };
    }),
});
