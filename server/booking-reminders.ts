import { getDb } from "./db";
import { bookings } from "../drizzle/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { sendBaileysMessage } from "./baileys-manager";

/**
 * Booking Reminder Scheduler
 * Sends WhatsApp reminders at 48h, 24h, and 1h before events
 */

// Track sent reminders to avoid duplicates
const sentReminders = new Set<string>();

/**
 * Check and send booking reminders
 * Should be called periodically (e.g., every hour)
 */
export async function checkAndSendReminders() {
  const db = await getDb();
  if (!db) {
    console.warn("[Reminders] Database not available");
    return;
  }

  const now = new Date();
  
  // Check for reminders at each interval
  await sendRemindersForInterval(48, now); // 48 hours before
  await sendRemindersForInterval(24, now); // 24 hours before
  await sendRemindersForInterval(1, now);  // 1 hour before
}

/**
 * Send reminders for a specific time interval
 */
async function sendRemindersForInterval(hoursBeforeEvent: number, now: Date) {
  const db = await getDb();
  if (!db) return;

  // Calculate the time window for this reminder
  const targetTime = new Date(now.getTime() + hoursBeforeEvent * 60 * 60 * 1000);
  const windowStart = new Date(targetTime.getTime() - 30 * 60 * 1000); // 30 min before
  const windowEnd = new Date(targetTime.getTime() + 30 * 60 * 1000);   // 30 min after

  try {
    // Find bookings in this time window that are confirmed
    const upcomingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "confirmed"),
          gte(bookings.eventDate, windowStart),
          lte(bookings.eventDate, windowEnd)
        )
      );

    for (const booking of upcomingBookings) {
      const reminderKey = `${booking.id}-${hoursBeforeEvent}h`;
      
      // Skip if already sent
      if (sentReminders.has(reminderKey)) {
        continue;
      }

      // Send reminder
      await sendBookingReminder(booking, hoursBeforeEvent);
      
      // Mark as sent
      sentReminders.add(reminderKey);
      
      console.log(`[Reminders] Sent ${hoursBeforeEvent}h reminder for booking #${booking.id}`);
    }
  } catch (error) {
    console.error(`[Reminders] Error checking ${hoursBeforeEvent}h reminders:`, error);
  }
}

/**
 * Send a booking reminder via WhatsApp
 */
async function sendBookingReminder(booking: any, hoursBeforeEvent: number) {
  if (!booking.clientPhone) {
    console.warn(`[Reminders] No phone number for booking #${booking.id}`);
    return;
  }

  const message = formatReminderMessage(booking, hoursBeforeEvent);
  
  try {
    // Note: userId should be retrieved from booking.userId or tenant settings
    // For now, using a default userId (1) - should be updated based on your multi-tenant setup
    await sendBaileysMessage(1, booking.clientPhone, message);
  } catch (error) {
    console.error(`[Reminders] Failed to send reminder for booking #${booking.id}:`, error);
  }
}

/**
 * Format reminder message based on time interval
 */
function formatReminderMessage(booking: any, hoursBeforeEvent: number): string {
  const eventDate = new Date(booking.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let timePhrase = "";
  if (hoursBeforeEvent === 48) {
    timePhrase = "in 2 days";
  } else if (hoursBeforeEvent === 24) {
    timePhrase = "tomorrow";
  } else if (hoursBeforeEvent === 1) {
    timePhrase = "in 1 hour";
  }

  return `✨ *AI LUXE Event Reminder*

Hello ${booking.clientName || "valued client"},

Your ${booking.eventType} event is coming up ${timePhrase}!

📅 *Date:* ${formattedDate}
⏰ *Time:* ${formattedTime}
📍 *Location:* ${booking.location || "TBD"}
${booking.guestCount ? `👥 *Guests:* ${booking.guestCount}` : ""}

${hoursBeforeEvent === 1 ? "🚨 *Final reminder* - Please ensure you're ready!" : ""}

If you need any last-minute changes or have questions, please reply to this message.

_Time is the Real Luxury_ ⏱️
AI LUXE Concierge`;
}

/**
 * Start the reminder scheduler
 * Checks every hour for upcoming events
 */
export function startReminderScheduler() {
  console.log("[Reminders] Scheduler started");
  
  // Run immediately
  checkAndSendReminders();
  
  // Then run every hour
  setInterval(checkAndSendReminders, 60 * 60 * 1000);
}

/**
 * Clear sent reminders cache (for testing)
 */
export function clearReminderCache() {
  sentReminders.clear();
  console.log("[Reminders] Cache cleared");
}
