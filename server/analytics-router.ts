import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { messages } from "../drizzle/schema";
import { sql, and, gte } from "drizzle-orm";

export const analyticsRouter = router({
  /**
   * Get analytics data for dashboard
   */
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        avgResponseTime: "2.3",
        conversionRate: "68",
        totalMessages: "0",
        totalBookings: "0",
        responseTimeTrend: [],
        conversionFunnel: [],
        peakHours: [],
        platformDistribution: [],
      };
    }

    try {
      // Get total messages count
      const messageCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages);

      const totalMessages = messageCount[0]?.count || 0;

      // Get platform distribution
      const platformStats = await db
        .select({
          platform: messages.platform,
          count: sql<number>`count(*)`,
        })
        .from(messages)
        .groupBy(messages.platform);

      const platformDistribution = platformStats.map((stat) => ({
        name: stat.platform.charAt(0).toUpperCase() + stat.platform.slice(1),
        value: Number(stat.count),
      }));

      // Mock data for other metrics (can be replaced with real queries)
      return {
        avgResponseTime: "2.3",
        conversionRate: "68",
        totalMessages: String(totalMessages),
        totalBookings: "42",
        responseTimeTrend: [
          { day: "Mon", time: 2.8 },
          { day: "Tue", time: 2.5 },
          { day: "Wed", time: 2.3 },
          { day: "Thu", time: 2.1 },
          { day: "Fri", time: 2.4 },
          { day: "Sat", time: 2.2 },
          { day: "Sun", time: 2.3 },
        ],
        conversionFunnel: [
          { stage: "Inquiries", count: 150 },
          { stage: "Quotes", count: 102 },
          { stage: "Confirmed", count: 68 },
          { stage: "Completed", count: 42 },
        ],
        peakHours: [
          { hour: "9AM", messages: 45 },
          { hour: "10AM", messages: 62 },
          { hour: "11AM", messages: 78 },
          { hour: "12PM", messages: 95 },
          { hour: "1PM", messages: 88 },
          { hour: "2PM", messages: 72 },
          { hour: "3PM", messages: 85 },
          { hour: "4PM", messages: 92 },
          { hour: "5PM", messages: 68 },
        ],
        platformDistribution:
          platformDistribution.length > 0
            ? platformDistribution
            : [
                { name: "WhatsApp", value: 720 },
                { name: "Instagram", value: 320 },
                { name: "Telegram", value: 150 },
                { name: "Signal", value: 57 },
              ],
      };
    } catch (error) {
      console.error("[Analytics] Error fetching analytics:", error);
      return {
        avgResponseTime: "2.3",
        conversionRate: "68",
        totalMessages: "0",
        totalBookings: "0",
        responseTimeTrend: [],
        conversionFunnel: [],
        peakHours: [],
        platformDistribution: [],
      };
    }
  }),
});
